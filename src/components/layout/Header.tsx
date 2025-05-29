"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Car, Search, User, HelpCircle, Wrench, Shield, Calculator, LogOut, Settings, FileText, TrendingUp, ShoppingCart, Target, Scale, Truck } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const { data: session, status } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="md" showText={true} />
          </Link>

          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Find Cars</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/search"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Search className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Advanced Search</div>
                          <div className="text-sm text-gray-600">
                            Filter by budget, make, model, and location
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/help-me-choose"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Help Me Choose</div>
                          <div className="text-sm text-gray-600">
                            Guided form for unsure buyers
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-4 gap-3 p-6 w-[1200px]">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/wizard"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-purple-50 border-l-4 border-purple-500"
                      >
                        <Settings className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-medium text-purple-700">Car Buying Wizard</div>
                          <div className="text-sm text-purple-600">
                            Guided journey through all tools
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/parts-comparison"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Parts Price Comparison</div>
                          <div className="text-sm text-gray-600">
                            Compare prices on car parts and accessories
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/cost-calculator"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Calculator className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Running Cost Calculator</div>
                          <div className="text-sm text-gray-600">
                            Estimate yearly running costs
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/mot-check"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Shield className="h-4 w-4" />
                        <div>
                          <div className="font-medium">MOT History Check</div>
                          <div className="text-sm text-gray-600">
                            Check MOT history and mileage trends
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/dealer-check"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Wrench className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Dealer Risk Check</div>
                          <div className="text-sm text-gray-600">
                            Verify dealer credentials and reviews
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/vehicle-check"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Vehicle History Check</div>
                          <div className="text-sm text-gray-600">
                            Comprehensive background check with payment
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/price-analysis"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Price Analysis</div>
                          <div className="text-sm text-gray-600">
                            Market analysis and buying expectations
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/maintenance"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Wrench className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Maintenance Tracker</div>
                          <div className="text-sm text-gray-600">
                            Log service history and track costs
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/car-comparison"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Car className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Car Comparison</div>
                          <div className="text-sm text-gray-600">
                            Compare vehicles side-by-side
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/vehicle-valuation"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Calculator className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Vehicle Valuation</div>
                          <div className="text-sm text-gray-600">
                            Get accurate vehicle valuations
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/tyre-shop-finder"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Target className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Tyre Shop Finder</div>
                          <div className="text-sm text-gray-600">
                            Find tyre shops and mobile fitting
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/legal-advice"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Scale className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Legal Advice</div>
                          <div className="text-sm text-gray-600">
                            Motor trade legal guidance
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/towing-guide"
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                      >
                        <Truck className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Towing Guide</div>
                          <div className="text-sm text-gray-600">
                            Vehicle finder for towing needs
                          </div>
                        </div>
                      </Link>
                    </NavigationMenuLink>

                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/about" className="px-4 py-2">
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:block">{session.user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="flex items-center text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/signup">
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  );
}
