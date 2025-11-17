"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Leaf, Users, BarChart3, Shield, ArrowRight, Menu, X, Sparkles, Droplets, Sun, Sprout, Trees } from "lucide-react"

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("landing")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showSection = (id) => {
    setActiveSection(id)
    setIsMobileMenuOpen(false)
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-lime-50/50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/40 to-green-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-lime-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-gradient-to-br from-lime-200/35 to-emerald-300/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating plant elements */}
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Leaf className="w-12 h-12 text-emerald-300/40" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-float delay-1000">
          <Sprout className="w-8 h-8 text-lime-400/30" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-float delay-1500">
          <Trees className="w-10 h-10 text-amber-400/25" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100/50" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                GreenThumb Pro
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => showSection("landing")}
                className="px-4 py-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors hover:bg-emerald-50 rounded-lg"
              >
                Home
              </button>
              <button
                onClick={() => showSection("role-selection")}
                className="px-4 py-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors hover:bg-emerald-50 rounded-lg"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
              >
                <span>Staff Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-lg">
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => showSection("landing")}
                  className="block w-full text-left px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => showSection("role-selection")}
                  className="block w-full text-left px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Staff Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <section
        className={`relative min-h-screen flex items-center ${activeSection === "landing" ? "block" : "hidden"}`}
      >
        {/* Enhanced Background with plant texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-green-800/60 to-transparent">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-2 text-emerald-300 bg-emerald-900/30 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Intelligent Plant Management</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Cultivate{" "}
                  <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">
                    Growth
                  </span>{" "}
                  & Prosperity
                </h1>
                <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed max-w-2xl">
                  Transform your nursery operations with our intelligent platform that nurtures both plants and profits through real-time tracking and data-driven cultivation insights.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => showSection("role-selection")}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span>Start Growing</span>
                  <Sprout className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2"
                >
                  <span>Staff Portal</span>
                  <Leaf className="w-5 h-5" />
                </button>
              </div>

              {/* Enhanced Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="flex items-center space-x-3 text-emerald-200 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-green-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-emerald-500/20">
                    <BarChart3 className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Growth Analytics</div>
                    <div className="text-sm text-emerald-300">Plant health insights</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-emerald-200 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500/30 to-orange-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-amber-500/20">
                    <Droplets className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Irrigation Control</div>
                    <div className="text-sm text-amber-300">Smart watering</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-emerald-200 bg-white/10 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/15 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-lime-500/30 to-green-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-lime-500/20">
                    <Sun className="w-6 h-6 text-lime-300" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Light Management</div>
                    <div className="text-sm text-lime-300">Optimal conditions</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Right side content */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-white text-center">Thriving With GreenThumb</h3>
                  
                  {/* Progress bars for growth metrics */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-emerald-200">
                        <span>Plant Health</span>
                        <span className="font-bold text-emerald-300">94%</span>
                      </div>
                      <div className="w-full bg-emerald-900/50 rounded-full h-3">
                        <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-3 rounded-full w-[94%] shadow-lg shadow-emerald-500/25"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-amber-200">
                        <span>Growth Rate</span>
                        <span className="font-bold text-amber-300">87%</span>
                      </div>
                      <div className="w-full bg-amber-900/50 rounded-full h-3">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full w-[87%] shadow-lg shadow-amber-500/25"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-lime-200">
                        <span>Yield Quality</span>
                        <span className="font-bold text-lime-300">96%</span>
                      </div>
                      <div className="w-full bg-lime-900/50 rounded-full h-3">
                        <div className="bg-gradient-to-r from-lime-400 to-green-500 h-3 rounded-full w-[96%] shadow-lg shadow-lime-500/25"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                      <div className="text-2xl font-bold text-emerald-300">500+</div>
                      <div className="text-emerald-200 text-sm">Thriving Nurseries</div>
                    </div>
                    <div className="text-center bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                      <div className="text-2xl font-bold text-amber-300">1M+</div>
                      <div className="text-amber-200 text-sm">Healthy Plants</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 lg:py-32 relative ${activeSection === "role-selection" ? "block" : "hidden"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-emerald-600 bg-emerald-100 rounded-full px-4 py-2 mb-6">
              <Sprout className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Choose Your Path</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Access Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-amber-600 bg-clip-text text-transparent">
                Garden Portal
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select your role to enter our ecosystem of plant management tools and cultivation expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <div
              onClick={() => navigate("/login")}
              className="group cursor-pointer bg-white rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-emerald-100 hover:border-emerald-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-green-600/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Cultivation Team</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access plant care schedules, growth tracking, inventory management, and customer interaction tools for daily nursery operations.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 bg-emerald-50 group-hover:bg-emerald-100 px-4 py-2 rounded-full transition-all">
                    Enter Garden Portal
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/login")}
              className="group cursor-pointer bg-white rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/5 to-orange-600/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10 text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Garden Master</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Oversee all operations, manage team members, access comprehensive analytics, and configure the entire nursery ecosystem.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="inline-flex items-center text-amber-600 font-semibold group-hover:text-amber-700 bg-amber-50 group-hover:bg-amber-100 px-4 py-2 rounded-full transition-all">
                    Access Control Center
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional info section */}
          <div className="max-w-3xl mx-auto mt-20 text-center">
            <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-3xl p-8 border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Cultivate Excellence?</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of nurseries that have transformed their operations with GreenThumb Pro.
              </p>
              <button
                onClick={() => showSection("landing")}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Learn More About Our Platform
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 text-white py-16 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold">GreenThumb Pro</span>
            </div>
            <p className="text-emerald-200 text-lg max-w-2xl mx-auto">
              Cultivating the future of horticulture through innovative technology and sustainable practices.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-emerald-300">
              <a href="#" className="hover:text-white transition-colors flex items-center space-x-2">
                <Leaf className="w-4 h-4" />
                <span>Privacy Policy</span>
              </a>
              <a href="#" className="hover:text-white transition-colors flex items-center space-x-2">
                <Sprout className="w-4 h-4" />
                <span>Terms of Service</span>
              </a>
              <a href="#" className="hover:text-white transition-colors flex items-center space-x-2">
                <Trees className="w-4 h-4" />
                <span>Contact Support</span>
              </a>
            </div>
            <div className="pt-8 border-t border-emerald-800">
              <p className="text-emerald-400">
                © 2025 GreenThumb Pro | Nurturing Growth, Harvesting Success
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
