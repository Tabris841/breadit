"use client";

import { type HTMLAttributes, useState } from "react";
import { signIn } from "next-auth/react";

import { Icons } from "./icons";
import { Button } from "./ui";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const UserAuthForm = ({ className, ...props }: Props) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loginWithGoogle = () => {
    setIsLoading(true);

    signIn("google")
      .catch(() => {
        toast({
          title: "Error",
          description: "There was an error logging in with Google",
          variant: "destructive",
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        isLoading={isLoading}
        type="button"
        size="sm"
        className="w-full"
        onClick={loginWithGoogle}
        disabled={isLoading}
      >
        {isLoading ? null : <Icons.google className="mr-2 h-4 w-4" />}
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
