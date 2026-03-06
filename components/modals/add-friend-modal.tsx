"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  friendId: z.string().optional(),
});

export function AddFriendModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friendId: "",
    },
  });

  const onManualSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values.friendId) return toast.error("Provide a user id to add");
      await api.addFriend(values.friendId);
      toast.success("Friend added successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to add friend. Check the ID.");
    }
  };

  const handleSearch = async () => {
    if (!query || query.trim().length < 2) {
      toast.error("Enter at least 2 characters to search");
      return;
    }
    setSearching(true);
    try {
      const res: any = await api.searchUsers(query.trim());
      setResults(res.users || []);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (id: string) => {
    try {
      await api.addFriend(id);
      toast.success("Friend added!");
      setOpen(false);
      setResults([]);
      form.reset();
    } catch (err) {
      toast.error("Could not add friend");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
          <DialogDescription>
            Search by name and add a friend, or enter their user ID manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name (min 2 chars)" />
            <Button onClick={handleSearch} disabled={searching}>{searching ? 'Searching...' : 'Search'}</Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2">
              {results.map((u) => (
                <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-muted/10 rounded">
                  <div className="flex-1">
                    <div className="font-medium">{u.name}</div>
                    <div className="text-xs text-muted-foreground">{u.email || u.id}</div>
                  </div>
                  <div>
                    <Button size="sm" onClick={() => handleAdd(u.id)}>Add</Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="friendId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., user_123xyz..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Adding..." : "Add Friend by ID"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}