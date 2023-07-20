"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { toast } from "@/hooks/use-toast";
import { type CommentRequest } from "@/lib/validators/comment";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { Label, Textarea, Button } from "@/components/ui";

type Props = {
  postId: string;
  replyToId?: string;
};

const CreateComment = ({ postId, replyToId }: Props) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToasts();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async (payload: CommentRequest) => {
      await axios.patch("/api/subreddit/post/comment", payload);
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="What are your thoughts?"
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => comment({ postId, text: input, replyToId })}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
