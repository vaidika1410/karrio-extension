"use client";

import {
    MoreHorizontal,
    Trash2,
} from "lucide-react";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { deleteApplication } from "@/services/applications.service";

export function ApplicationRowActions({
    applicationId,
}: {
    applicationId: string;
}) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () =>
            deleteApplication(applicationId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["applications"],
            });
        },
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md hover:bg-accent"
                >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl backdrop-blur-2xl border p-1 shadow-xl"
            >
                <DropdownMenuItem
                    onClick={() =>
                        mutation.mutate()
                    }
                    className="
    cursor-pointer
    rounded-md
    text-red-400
    focus:bg-red-500/40
    focus:text-red-400
    data-[highlighted]:bg-red-500/10
    data-[highlighted]:text-red-400
  "
                >
                    <Trash2 className="mr-2 h-4 w-4" />

                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}