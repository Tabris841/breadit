import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body: unknown = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    // check if user has already voted on this post
    const existingVote = await db.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (!existingVote) {
      await db.commentVote.create({
        data: {
          type: voteType,
          userId: session.user.id,
          commentId,
        },
      });
      return new Response("OK");
    }

    if (existingVote.type === voteType) {
      await db.commentVote.delete({
        where: {
          userId_commentId: {
            commentId,
            userId: session.user.id,
          },
        },
      });
      return new Response("OK");
    }

    await db.commentVote.update({
      where: {
        userId_commentId: {
          commentId,
          userId: session.user.id,
        },
      },
      data: {
        type: voteType,
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not post to subreddit at this time. Please try later",
      { status: 500 },
    );
  }
}
