"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2, IndianRupee } from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/types"; // Ensure you have this type

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Schema for the bill
const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  totalAmount: z.number().min(1, "Amount must be greater than 0"),
  splitType: z.enum(["EQUAL", "EXACT", "PERCENTAGE"]),
  participants: z.array(z.string()).min(1, "Select at least one friend"),
  // Optional: Add manual splits array if you implement EXACT/PERCENTAGE logic fully
});

export function CreateBillModal({ onBillCreated }: { onBillCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState<User[]>([]); // Fetch this on mount

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      totalAmount: 0,
      splitType: "EQUAL",
      participants: [],
    },
  });

  // Fetch friends when modal opens
  useEffect(() => {
    if (open) {
      api.getMe().then((data) => {
        // Assuming your user object has a 'friends' array or similar. 
        // If not, you might need a separate /friends endpoint.
        // For now, let's assume we can fetch them or mock them.
        // setFriends(data.friends || []); 
        
        // Mocking friends for display until you add the friends list endpoint
        setFriends([
            { id: "1", name: "Alice", email: "alice@ex.com" },
            { id: "2", name: "Bob", email: "bob@ex.com" },
        ] as any);
      });
    }
  }, [open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await api.createBill({
        description: values.description,
        totalAmount: values.totalAmount,
        splitType: values.splitType,
        participants: values.participants,
      });
      toast.success("Bill created successfully!");
      setOpen(false);
      form.reset();
      if (onBillCreated) onBillCreated();
    } catch (error) {
      toast.error("Failed to create bill.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-4 w-4" /> New Bill
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Expense</DialogTitle>
          <DialogDescription>
            Add a new bill and split it with your friends.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Dinner at Moti Mahal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount (₹)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input type="number" className="pl-9" placeholder="0.00" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Split Type */}
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select split type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="EQUAL">Equally</SelectItem>
                      <SelectItem value="EXACT">Exact Amounts</SelectItem>
                      <SelectItem value="PERCENTAGE">By Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Participants Selection */}
            <FormField
              control={form.control}
              name="participants"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Split with</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Select friends to include in this bill.
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 border rounded-md p-4 max-h-40 overflow-y-auto">
                    {friends.map((friend) => (
                      <FormField
                        key={friend.id}
                        control={form.control}
                        name="participants"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={friend.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(friend.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, friend.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== friend.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {friend.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    {friends.length === 0 && (
                        <p className="text-xs text-muted-foreground col-span-2">No friends found. Add a friend first.</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Bill"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}