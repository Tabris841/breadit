"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import type { ExtendedPost } from "@/types/db";
import Post from "./post";

type Props = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
};

const PostFeed = ({ initialPosts, subredditName }: Props) => {
  const lastPostRef = useRef<HTMLElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [`infinite-query-${subredditName}`],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const { data } = await axios.get<ExtendedPost[]>(query);
      return data;
    },

    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === INFINITE_SCROLL_PAGINATION_RESULTS
          ? allPages.length + 1
          : undefined;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    },
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage().catch((e) => {
        console.log(e);
      }); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 flex flex-col space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id,
        );

        if (index === posts.length - 1) {
          // Add a ref to the last post in the list
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              commentAmt={post.comments.length}
              subredditName={post.subreddit.name}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          );
        }
      })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
