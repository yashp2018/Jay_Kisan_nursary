"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Leaf, Users, BarChart3, Shield, ArrowRight, Menu, X, Sparkles } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/30 to-green-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-teal-200/20 to-emerald-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-gradient-to-br from-green-200/25 to-lime-300/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                Plant Nursery
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => showSection("role-selection")}
                className="px-4 py-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Staff Login
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
                  onClick={() => showSection("role-selection")}
                  className="block w-full text-left px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="block w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all"
                >
                  Staff Login
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <section
        className={`relative min-h-screen flex items-center ${activeSection === "landing" ? "block" : "hidden"}`}
      >
        {/* Background Image */}
       
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-green-800/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Next-Gen Plant Management</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Cultivate Growth with{" "}
                  <span className="bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">
                    Plant Nursery
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed max-w-2xl">
                  Transform your nursery operations with intelligent plant management, real-time inventory tracking, and
                  data-driven insights that nurture both plants and profits.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => showSection("role-selection")}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full font-semibold text-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                >
                  Staff Portal
                </button>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                <div className="flex items-center space-x-3 text-emerald-200">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Smart Analytics</div>
                    <div className="text-sm text-emerald-300">Real-time insights</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-emerald-200">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Secure Platform</div>
                    <div className="text-sm text-emerald-300">Enterprise-grade</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-emerald-200">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Team Collaboration</div>
                    <div className="text-sm text-emerald-300">Seamless workflow</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side content */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Trusted by Nurseries Worldwide</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-300">500+</div>
                      <div className="text-emerald-200">Active Nurseries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-300">1M+</div>
                      <div className="text-emerald-200">Plants Managed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-300">99.9%</div>
                      <div className="text-emerald-200">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-300">24/7</div>
                      <div className="text-emerald-200">Support</div>
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                Access Level
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the portal that matches your role and start managing your nursery operations more efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
            <div
              onClick={() => navigate("/login")}
              className="group cursor-pointer bg-white rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-emerald-100 hover:border-emerald-300"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Staff Member</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Access plant care schedules, inventory management, customer interaction tools, and daily operational
                    features.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
                    Access Staff Portal
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={() => navigate("/login")}
              className="group cursor-pointer bg-white rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-emerald-100 hover:border-emerald-300"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Administrator</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Manage users, view comprehensive analytics, configure system settings, and oversee all nursery
                    operations.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
                    Access Admin Dashboard
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-r from-emerald-900 to-green-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Plant Nursery</span>
            </div>
            <p className="text-emerald-200 text-lg">
              © 2025 Plant Nursery Pro | Cultivating Excellence in Horticulture Management
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-emerald-300">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
