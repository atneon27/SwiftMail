import { ReactNode } from "react";
import Link from "next/link";
import { Button  } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
import { ArrowRight, Mail, Search, Command } from "lucide-react";
import {Card, CardContent} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black dark:text-white mt-auto relative z-[10] w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-slate-900 flex items-center justify-center mr-2">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">Swift Mail</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 max-w-xs dark:text-gray-300">
              The minimalistic, AI-powered email client that empowers you to manage your email with ease.
            </p>
          </div>
          
          {/* <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-gray-200 hover:text-slate-900">Features</a></li>
                <li><a href="#" className="text-slate-600 dark:text-gray-200 hover:text-slate-900">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-slate-600 dark:text-gray-200 hover:text-slate-900">Help Center</a></li>
                <li><a href="#" className="text-slate-600 dark:text-gray-200 hover:text-slate-900">Contact</a></li>
                <li><a href="#" className="text-slate-600 dark:text-gray-200 hover:text-slate-900">Status</a></li>
              </ul>
            </div>
          </div> */}
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Swift Mail. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-slate-500 dark:text-gray-300 hover:text-slate-900">
              Privacy
            </a>
            <a href="#" className="text-slate-500 dark:text-gray-300 hover:text-slate-900">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FeatureProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => {
    return (
      <Card className="overflow-hidden border dark:border-slate-500 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 h-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="rounded-full p-3 bg-blue-50 mb-4">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-slate-600 dark:text-gray-200">{description}</p>
        </CardContent>
      </Card>
    );
  };



const Home = async() =>  { 
    const { userId } = await auth()

    if(userId) {
        redirect('/mail')
    }

    return (
        <>
            {/* <div className="h-screen w-full bg-white absolute inset-0">
            </div> */}
            <div className="absolute z-[-1] bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_80%)]">
            </div>
            <div className="min-h-screen flex flex-col items-center pt-56 relative z-[10]">
                <section className="container px-4 pt-16 md:pt-24 lg:pt-32 pb-12 md:pb-20 flex flex-col items-center relative z-[10] bg-slate-">
                    <div className="space-y-4 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent animate-fade-in bg-gray-">
                        The minimalistic,<br />
                        AI-powered email client.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-gray-200 max-w-2xl mx-auto animate-fade-in">
                        Swift Mail is a minimalistic, AI-powered email client that
                        empowers you to manage your email with ease.
                    </p>
                    <div className="pt-6 animate-fade-in">
                         <Link href="/signup" className="text-md hover:underline hover:text-red-500">
                            <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-md dark:bg-white dark:text-black px-8 py-6 text-lg font-medium group">
                                Get Started
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                    </div>

                    <div className="w-full max-w-4xl mx-auto mt-16 md:mt-24 overflow-hidden rounded-xl shadow-2xl animate-scale-in">
                      <div className="relative bg-slate-900 h-8 flex items-center px-4">
                          <div className="flex space-x-2 absolute left-4">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="w-full text-center text-xs text-gray-200">Swift Mail - Inbox</div>
                      </div>
                      <div className="bg-white dark:bg-black h-[500px] md:h-[450px] p-4 bg-[url('/mailbox_light.png')] dark:bg-[url('/mailbox_dark.png')] bg-contain bg-no-repeat"></div>
                  </div>
                </section>

                <section className="container px-4 py-16 md:py-24">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Experience the power of:</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Feature 
                        icon={<Mail className="h-8 w-8 text-blue-600" />}
                        title="AI-driven email RAG"
                        description="Automatically prioritize your emails with our advanced AI system that learns from your habits."
                    />
                    
                    <Feature 
                        icon={<Search className="h-8 w-8 text-blue-600" />}
                        title="Full-text search"
                        description="Quickly find any email with our powerful search functionality that indexes all your messages."
                    />
                    
                    <Feature 
                        icon={<Command className="h-8 w-8 text-blue-600" />}
                        title="Shortcut-focused interface"
                        description="Navigate your inbox efficiently with our intuitive keyboard shortcuts designed for power users."
                    />
                    </div>

                    <div className="mt-16 md:mt-24 text-center">
                    <h3 className="text-xl md:text-2xl font-semibold mb-6">Ready to transform your email experience?</h3>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/signup" className="text-md hover:underline hover:text-red-500">
                            <Button variant="outline" className="border-slate-300 dark:text-white text-slate-800 hover:bg-slate-100 hover:text-black">
                                Sign Up Free
                            </Button>
                        </Link>
                       
                        <Link href="/signin" className="text-md hover:underline hover:text-red-500">
                            <Button className="bg-slate-900 dark:bg-gray-100 dark:text-black hover:bg-slate-800 text-white">
                                Sign In
                            </Button>
                        </Link>  

                        <ThemeToggle />
                    </div>
                    </div>
                </section>
                
                <Footer />
            </div>
        </>
    )
}

export default Home;