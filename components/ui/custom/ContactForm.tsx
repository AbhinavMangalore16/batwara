"use client";
import React, { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    // Basic email check
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in name, email and message.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("sending");

    try {
      // Try posting to an API route; if none exists this may fail and we'll fallback
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Server error");
        throw new Error(text || "Server error");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Unable to send message. Try again later.");
    }
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Get in touch</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Have feedback or need help? Send us a message and we'll reply within 24 hours.
      </p>

      <form className="my-8 space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900/50 border border-neutral-700 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900/50 border border-neutral-700 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Subject Input */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-neutral-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
            className="w-full px-4 py-3 rounded-lg bg-neutral-900/50 border border-neutral-700 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more..."
            className="w-full px-4 py-3 rounded-lg bg-neutral-900/50 border border-neutral-700 text-white placeholder:text-neutral-600 focus:border-blue-500 focus:outline-none transition-colors resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {/* Response note */}
        <p className="text-xs text-neutral-500 text-center">We'll get back to you within 24 hours.</p>

        {/* Status / Error */}
        <div aria-live="polite" className="mt-2 min-h-[1.25rem] text-center">
          {status === "success" && <p className="text-sm text-emerald-500">Message sent — thank you!</p>}
          {status === "error" && <p className="text-sm text-red-500">{error}</p>}
          {error && status !== "error" && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </form>
    </div>
  );
}
