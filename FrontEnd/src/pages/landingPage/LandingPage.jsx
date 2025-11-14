import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Target,
  Award,
} from "lucide-react"
import { founders } from "../../lib/founder-data"

export default function JaiKisaanLanding() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showStaffLogin, setShowStaffLogin] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const handleOrderClick = () => {
    setShowOrderForm(true)
    setTimeout(() => {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  // Remove the inline staff login modal and use navigation instead
  const handleStaffLogin = () => {
    navigate('/login')
  }

  const slides = [
    {
      title: "स्वागत है जय किसान में",
      subtitle: "आपके बागवानी व्यवसाय के लिए सर्वश्रेष्ठ समाधान",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/beautiful-green-garden-with-plants-and-flowers-h9IeVANxJU5TVv7ZBrlBugReW2Q6w3.jpg",
    },
    {
      title: "गुणवत्तापूर्ण पौधे और बीज",
      subtitle: "25+ वर्षों का अनुभव और विश्वास",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/organic-vegetable-seeds-and-seedlings-n1yj2T79qye4VRDNo5H1Ilc28r7Zoj.jpg",
    },
    {
      title: "आपकी सफलता हमारी प्रतिबद्धता",
      subtitle: "5000+ संतुष्ट ग्राहक",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/colorful-flowers-and-flowering-plants-AsInlidAq9MrQMx9jKgpeBQesD1jmO.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-orange-50">
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100" : "bg-white/80"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-3">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bgremoved-BLqy8CNW3dLbWsg28OvgovdVn1IErt.png"
                alt="Jai Kisaan Logo"
                width={50}
                height={50}
                className="h-12 w-auto"
              />
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
                जय किसान
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
                className="px-4 py-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
              >
                सेवाएं
              </button>
              <button
                onClick={() => document.getElementById("founder")?.scrollIntoView({ behavior: "smooth" })}
                className="px-4 py-2 text-emerald-700 hover:text-emerald-900 font-medium transition-colors"
              >
                संस्थापक
              </button>
              <button
                onClick={handleStaffLogin}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-orange-500 text-white rounded-full hover:from-emerald-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                स्टाफ लॉगिन
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
                  onClick={() => {
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  सेवाएं
                </button>
                <button
                  onClick={() => {
                    document.getElementById("founder")?.scrollIntoView({ behavior: "smooth" })
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  संस्थापक
                </button>
                <button
                  onClick={handleStaffLogin}
                  className="block w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-orange-500 text-white rounded-lg hover:from-emerald-600 hover:to-orange-600 transition-all font-semibold"
                >
                  स्टाफ लॉगिन
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Rest of your component remains the same */}
      {/* Hero Slider Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-orange-800/50 to-transparent"></div>
            </div>

            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">{slide.title}</h1>
                <p className="text-2xl lg:text-3xl text-emerald-100 max-w-2xl">{slide.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    onClick={handleOrderClick}
                    className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
                  >
                    <span>ऑर्डर करें</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slider Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-emerald-600 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">5000+</div>
              <div className="text-emerald-100 text-lg">संतुष्ट ग्राहक</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">25+</div>
              <div className="text-emerald-100 text-lg">वर्षों का अनुभव</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">100%</div>
              <div className="text-emerald-100 text-lg">गुणवत्ता</div>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
              <div className="text-emerald-100 text-lg">प्रकार की प्रजातियाँ</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              हमारी{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
                सेवाएं
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              जय किसान आपके सभी बागवानी आवश्यकताओं के लिए व्यापक समाधान प्रदान करता है
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-emerald-100 hover:border-orange-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">पौधे और बीज</h3>
              <p className="text-gray-600 leading-relaxed">उच्च गुणवत्ता के पौधे, बीज और सजावटी पौधे</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-emerald-100 hover:border-orange-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">संरक्षण सेवा</h3>
              <p className="text-gray-600 leading-relaxed">कीटनाशक और पौधों की देखभाल के उत्पाद</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-emerald-100 hover:border-orange-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">सलाह सेवा</h3>
              <p className="text-gray-600 leading-relaxed">विशेषज्ञ बागवानी सलाह और मार्गदर्शन</p>
            </div>

            <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-emerald-100 hover:border-orange-400 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">होम डिलीवरी</h3>
              <p className="text-gray-600 leading-relaxed">तेजी से और सुरक्षित होम डिलीवरी सेवा</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section id="founder" className="py-20 lg:py-32 bg-gradient-to-br from-white via-emerald-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              हमारे{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
                संस्थापक
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">25+ वर्षों का अनुभव और समर्पण</p>
          </div>

          <div className="grid md:grid-cols-1 gap-12 mb-16 max-w-2xl mx-auto">
            {founders.map((founder, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-emerald-100 hover:border-orange-400 transform hover:-translate-y-2"
              >
                {/* Founder Image */}
                <div className="relative h-96 md:h-[500px] overflow-hidden bg-gradient-to-br from-emerald-400 to-green-500">
                  <img
                    src={founder.image || "/placeholder.svg"}
                    alt={founder.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Founder Info */}
                <div className="p-12">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{founder.name}</h3>
                  <p className="text-orange-600 font-semibold mb-6 text-2xl">{founder.title}</p>
                  <p className="text-gray-700 leading-relaxed mb-8 text-lg">{founder.bio}</p>

                  {/* Expertise */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-emerald-600" />
                      विशेषज्ञता के क्षेत्र
                    </p>
                    <p className="text-gray-700 text-base leading-relaxed">{founder.expertise}</p>
                  </div>

                  {/* Achievements */}
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      मुख्य उपलब्धियां और पुरस्कार
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {founder.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-lg p-3">
                          <span className="w-2 h-2 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form" className="py-20 lg:py-32 bg-gradient-to-br from-emerald-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              हमसे{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-orange-600 bg-clip-text text-transparent">
                संपर्क करें
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">अपने ऑर्डर और सवालों के लिए हमसे संपर्क करें</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border-2 border-emerald-100">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">नाम*</label>
                  <input
                    type="text"
                    placeholder="आपका नाम"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">ईमेल*</label>
                  <input
                    type="email"
                    placeholder="आपका ईमेल"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">फोन नंबर*</label>
                <input
                  type="tel"
                  placeholder="आपका फोन नंबर"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">आवश्यक पौधे/बीज*</label>
                <input
                  type="text"
                  placeholder="कौन से पौधे या बीज चाहिए?"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">संदेश/विवरण*</label>
                <textarea
                  placeholder="आपके ऑर्डर का विवरण"
                  rows="5"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-orange-500 text-white rounded-lg hover:from-emerald-600 hover:to-orange-600 transition-all font-semibold text-lg transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                ऑर्डर सबमिट करें
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-emerald-900 to-orange-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Leaf className="w-8 h-8" />
              <span className="text-2xl font-bold">जय किसान</span>
            </div>
            <p className="text-emerald-200 text-lg">© 2025 जय किसान | बागवानी में उत्कृष्टता के लिए प्रतिबद्ध</p>
            <div className="flex flex-wrap justify-center gap-6 text-emerald-300">
              <a href="#" className="hover:text-white transition-colors">
                गोपनीयता नीति
              </a>
              <a href="#" className="hover:text-white transition-colors">
                सेवा की शर्तें
              </a>
              <a href="#" className="hover:text-white transition-colors">
                सहायता संपर्क करें
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
