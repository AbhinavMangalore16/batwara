import { AnimatedTestimonials } from "../animated-testimonials";
import { TestimonialTitle } from "./TestimonialTitle";

export const CustomTestimonies = () =>{
      const testimonials = [
    {
      quote:
        "We stopped arguing over who owes what. Batwara made splitting bills effortless and fair for our household.",
      name: "Roommates, Mumbai",
      designation: "Roommates",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The graph settlements cut down transactions after our trip — everyone paid what they owed in two clicks.",
      name: "Friends, Bangalore",
      designation: "Group Organizer",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "AI insights helped us spot spending patterns and suggested fair allocations — a real timesaver.",
      name: "Travel Group, Delhi",
      designation: "Frequent Traveler",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Secure sync across devices made it easy to keep records and settle debts without awkward messages.",
      name: "Office Team, Hyderabad",
      designation: "Team Lead",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Clear history, simple groups, and fair splits — Batwara keeps money matters friendly.",
      name: "Flatmates, Pune",
      designation: "Flatmates",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  return (
    <div>
      <AnimatedTestimonials testimonials={testimonials} autoplay/>
    </div>
)
}