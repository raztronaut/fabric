"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Check your email</h1>
        <p className="text-muted-foreground text-sm">
          We've sent you a verification link to complete your registration
        </p>
      </div>
      <Card className="border-none shadow-lg">
        <CardContent className="pt-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 125 }}
            className="flex justify-center mb-6"
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <Mail className="h-6 w-6" />
            </div>
          </motion.div>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Click the link in your email to verify your account. If you don't see it,
                check your spam folder.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Verification email sent successfully</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                >
                  Back to sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Didn't receive the email?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Try another email
          </Link>
        </p>
        <p className="text-xs text-muted-foreground">
          Please allow a few minutes for the email to arrive
        </p>
      </div>
    </motion.div>
  );
} 