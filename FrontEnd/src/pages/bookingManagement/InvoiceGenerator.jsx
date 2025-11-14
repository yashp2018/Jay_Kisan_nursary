import React, { useEffect, useRef, useState } from "react";
import axios from "../../lib/axios";
import { COMPANY_INFO } from "../../config/company";

// Invoice content component
export function InvoiceContent({ booking, type = "final" }) {
  console.log("📄 InvoiceContent received booking:", booking);

  const defaultCompany = {
    name: COMPANY_INFO?.name || "जय किसान नर्सरी",
    address: COMPANY_INFO?.address || "ग्रीन व्हॅली, क्रॉप सिटी",
    cityStateZip: COMPANY_INFO?.cityStateZip || "महाराष्ट्र, ४२३२०३",
    phone: COMPANY_INFO?.phone || "+९१ ९८७६५ ४३२१०",
    email: COMPANY_INFO?.email || "info@jaikisaannursery.com",
    gstin: COMPANY_INFO?.gstin || "",
    logoUrl: COMPANY_INFO?.logoUrl || "",
  };

  // Generate invoice number and date
  const invoiceNo = booking?.invoiceNo || `INV-${Date.now().toString().slice(-8)}`;
  const invoiceDate = booking?.invoiceDate || new Date().toLocaleDateString("en-GB");

  // Company info
  const companyName = defaultCompany.name;
  const companyAddress = defaultCompany.address;
  const companyCityStateZip = defaultCompany.cityStateZip;
  const companyPhone = defaultCompany.phone;
  const companyGstin = defaultCompany.gstin;
  const companyLogo = defaultCompany.logoUrl;

  // Farmer data - handle different data structures
  const farmerData = booking?.farmerId || booking?.farmer || {};
  console.log("👨‍🌾 Farmer data:", farmerData);
  
  const farmerName = farmerData?.fullName || farmerData?.name || "ग्राहकाचे नाव";
  const farmerRegistrationNo = farmerData?.registrationNo || farmerData?.regNo || "N/A";
  const farmerAddress = farmerData?.address || "पत्ता उपलब्ध नाही";
  const farmerPhone = farmerData?.phone || farmerData?.mobile || "+९१ XXXXX XXXXX";

  // Booking details
  const bookingId = booking?._id || booking?.bookingId || "N/A";
  const plotNumber = booking?.plotNumber || "N/A";
  const lotNumber = booking?.lotNumber || "N/A";
  const cropGroup = typeof booking?.cropGroup === 'object' ? booking?.cropGroup?.name || "N/A" : booking?.cropGroup || "N/A";

  // Date formatting
  const toGBDate = (val) => {
    if (!val) return "N/A";
    try {
      const d = new Date(val);
      return isNaN(d) ? "N/A" : d.toLocaleDateString("en-GB");
    } catch {
      return "N/A";
    }
  };

  const bookingDate = toGBDate(booking?.bookingDate);
  const sowingDate = toGBDate(booking?.sowingDate);
  const dispatchDate = toGBDate(booking?.dispatchDate);

  // Vehicle details
  const vehicleNumber = booking?.vehicleNumber || "N/A";
  const driverName = booking?.driverName || "N/A";
  const startKm = booking?.startKm || 0;
  const endKm = booking?.endKm || 0;
  const totalKm = Math.max(0, endKm - startKm);

  // Varieties and pricing - handle different data structures
  let varieties = [];
  if (Array.isArray(booking?.varieties)) {
    varieties = booking.varieties.map(v => ({
      name: v.name || v.varietyName || "Unknown Variety",
      quantity: v.quantity || v.qty || 0,
      ratePerUnit: v.ratePerUnit || v.rate || 0,
      total: v.total || ((v.quantity || 0) * (v.ratePerUnit || 0))
    }));
  } else if (booking?.variety) {
    // Handle single variety case
    varieties = [{
      name: booking.variety,
      quantity: booking.quantity || 1,
      ratePerUnit: booking.ratePerUnit || booking.rate || 0,
      total: booking.total || 0
    }];
  }

  console.log("🌱 Varieties data:", varieties);

  // Calculate amounts with fallbacks
  const varietiesTotal = varieties.reduce((sum, v) => sum + (v.total || 0), 0);
  const totalAmount = Number(
    booking?.finalTotalPrice || 
    booking?.totalPayment || 
    booking?.amount || 
    varietiesTotal
  );
  
  const advancePayment = Number(booking?.advancePayment || booking?.advance || 0);
  const pendingPayment = Number(booking?.pendingPayment || Math.max(0, totalAmount - advancePayment));

  const notes = booking?.notes || "पेमेंट ३० दिवसांच्या आत भरणे आवश्यक आहे. कृपया पेमेंटसोबत इन्व्हॉइस क्रमांक समाविष्ट करा.";

  return (
    <div
      style={{
        width: "800px",
        padding: "32px",
        backgroundColor: "white",
        color: "#1a1a1a",
        fontFamily: "'Segoe UI', 'Arial', 'Noto Sans Devanagari', sans-serif",
        boxSizing: "border-box",
        lineHeight: 1.5,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header with gradient background */}
      <div style={{
        background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
        margin: "-32px -32px 24px -32px",
        padding: "24px 32px",
        borderRadius: "0 0 16px 16px"
      }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "800",
            textAlign: "center",
            margin: "0",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {pendingPayment === 0 ? "🧾 अंतिम बिल / Final Bill" : "📄 बिल / Invoice"}
        </h1>
        
        {pendingPayment === 0 && (
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 20px",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
                borderRadius: "25px",
                fontWeight: 700,
                fontSize: "14px",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              ✅ भरलेले / Paid
            </span>
          </div>
        )}
      </div>

      {/* Company and Invoice Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "24px",
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ flex: 1 }}>
          {companyLogo ? (
            <img
              src={companyLogo}
              alt="Company Logo"
              style={{
                width: 90,
                height: 90,
                objectFit: "contain",
                marginBottom: "12px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
          ) : null}
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px", color: "#16a34a" }}>
            {companyName}
          </h2>
          <div style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.6 }}>
            📍 {companyAddress}
            <br />
            🏙️ {companyCityStateZip}
            <br />
            📞 {companyPhone}
            {companyGstin ? (
              <>
                <br />
                🏢 जीएसटीआयएन / GSTIN: {companyGstin}
              </>
            ) : null}
          </div>
        </div>
        
        <div style={{ textAlign: "right", backgroundColor: "white", padding: "16px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: "12px" }}>
            <strong style={{ fontSize: "16px", color: "#16a34a", display: "block" }}>📋 बिल क्र. / Invoice No.</strong>
            <span style={{ fontSize: "18px", color: "#1e293b", fontWeight: "600" }}>{invoiceNo}</span>
          </div>
          <div>
            <strong style={{ fontSize: "16px", color: "#16a34a", display: "block" }}>📅 बिलाची तारीख / Date</strong>
            <span style={{ fontSize: "16px", color: "#1e293b", fontWeight: "500" }}>{invoiceDate}</span>
          </div>
        </div>
      </div>

      {/* Farmer Info */}
      <div style={{ marginBottom: "24px", padding: "20px", background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%)", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#1e40af", display: "flex", alignItems: "center" }}>
          👤 बिल ज्यांना पाठवले आहे / Billed To
        </h3>
        <div style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" }}>
          {farmerName}
        </div>
        <div style={{ fontSize: "15px", color: "#475569", lineHeight: 1.6 }}>
          🆔 नोंदणी क्र. / Reg No: <span style={{ fontFamily: 'monospace', backgroundColor: "white", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>{farmerRegistrationNo}</span>
          <br />
          📍 {farmerAddress}
          <br />
          📞 फोन / Phone: {farmerPhone}
        </div>
      </div>

      {/* Booking Details */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#16a34a", display: "flex", alignItems: "center" }}>
          📋 बुकिंग आणि पीक तपशील / Booking & Crop Details
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "20px", backgroundColor: "#f1f5f9", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
          {[
            ["🆔 बुकिंग आयडी / Booking ID", bookingId],
            ["👨‍🌾 शेतकऱ्याचे नाव / Farmer Name", farmerName],
            ["📝 नोंदणी क्र. / Registration No", farmerRegistrationNo],
            ["🏞️ प्लॉट क्र. / Plot No.", plotNumber],
            ["📦 लॉट क्र. / Lot No.", lotNumber],
            ["🌾 पीक गट / Crop Group", cropGroup],
            ["📅 बुकिंगची तारीख / Booking Date", bookingDate],
            ["🚛 वाहन क्र. / Vehicle No.", vehicleNumber],
            ["👨‍💼 चालकाचे नाव / Driver Name", driverName],
            ["🛣️ एकूण किलोमीटर / Total KM", `${totalKm} km`],
          ].map(([label, value], index) => (
            <div key={index} style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "15px", color: "#1e293b", fontWeight: "500" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Varieties Details */}
      {varieties.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "12px", color: "#333" }}>
            पिकाच्या प्रकारांचा तपशील / Crop Varieties Details
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }} border="1" cellPadding="8">
            <thead style={{ backgroundColor: "#f5f5f5" }}>
              <tr>
                <th style={{ textAlign: "left", fontWeight: "600", padding: "10px" }}>प्रकार / Variety</th>
                <th style={{ textAlign: "center", fontWeight: "600", padding: "10px" }}>प्रमाण / Quantity</th>
                <th style={{ textAlign: "center", fontWeight: "600", padding: "10px" }}>दर (₹) / Rate (₹)</th>
                <th style={{ textAlign: "right", fontWeight: "600", padding: "10px" }}>एकूण (₹) / Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {varieties.map((variety, index) => (
                <tr key={index}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>{variety.name}</td>
                  <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>{variety.quantity}</td>
                  <td style={{ textAlign: "center", padding: "10px", border: "1px solid #ddd" }}>
                    {Number(variety.ratePerUnit || 0).toFixed(2)}
                  </td>
                  <td style={{ textAlign: "right", padding: "10px", border: "1px solid #ddd" }}>
                    {Number(variety.total || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr style={{ backgroundColor: "#f0f9ff", fontWeight: "600" }}>
                <td colSpan="3" style={{ textAlign: "right", padding: "10px", border: "1px solid #ddd" }}>
                  एकूण / Total:
                </td>
                <td style={{ textAlign: "right", padding: "10px", border: "1px solid #ddd" }}>
                  ₹{varietiesTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Summary */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px", color: "#16a34a", display: "flex", alignItems: "center" }}>
          💰 पेमेंट सारांश / Payment Summary
        </h3>
        <div style={{ background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", padding: "20px", borderRadius: "12px", border: "2px solid #f59e0b" }}>
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              ["💵 एकूण रक्कम / Total Amount", totalAmount.toFixed(2), "#059669"],
              ["💳 आगाऊ रक्कम / Advance Payment", advancePayment.toFixed(2), "#0ea5e9"],
              ["💸 पेमेंट प्रकार / Payment Method", booking?.paymentMethod || "Cash", "#8b5cf6"],
              ["⏳ थकबाकी / Remaining Payment", pendingPayment.toFixed(2), pendingPayment > 0 ? "#dc2626" : "#059669"],
            ].map(([label, value, color], index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", padding: "12px 16px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <span style={{ fontSize: "15px", fontWeight: "600", color: "#374151" }}>{label}</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: color }}>
                  {typeof value === 'string' && !value.includes('₹') && !isNaN(parseFloat(value)) ? `₹${value}` : value}
                </span>
              </div>
            ))}
            
            {/* Final Total - Highlighted */}
            <div style={{ backgroundColor: "#16a34a", color: "white", padding: "16px", borderRadius: "10px", marginTop: "8px", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "800" }}>🏆 अंतिम एकूण / Final Total</span>
                <span style={{ fontSize: "20px", fontWeight: "800" }}>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{ padding: "20px", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", borderRadius: "12px", fontSize: "15px", color: "#475569", border: "1px solid #cbd5e1" }}>
        <h3 style={{ fontWeight: "700", marginBottom: "12px", color: "#1e293b", display: "flex", alignItems: "center" }}>
          📝 टीप/अटी आणि शर्ती / Notes/Terms & Conditions:
        </h3>
        <p style={{ margin: 0, lineHeight: 1.6, backgroundColor: "white", padding: "12px", borderRadius: "6px" }}>{notes}</p>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "32px", textAlign: "center", padding: "24px", background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)", borderRadius: "12px", color: "white" }}>
        <p style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
          🙏 तुमच्या व्यवसायाबद्दल धन्यवाद! / Thank you for your business!
        </p>
        <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>
          💻 हे बिल संगणकीय प्रणालीद्वारे तयार केले गेले आहे / This invoice is computer generated
        </p>
      </div>
    </div>
  );
}

// Main Invoice Download Component
export default function InvoiceDownloadButton({ bookingId, type = "final" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  const invoiceRef = useRef(null);

  // Fetch booking data when modal opens
  useEffect(() => {
    let cancelled = false;
    if (!isOpen) return;

    if (!bookingId) {
      setError("कोणताही बुकिंग आयडी दिलेला नाही. / No booking ID provided.");
      return;
    }

    const fetchInvoiceData = async () => {
      setFetching(true);
      setError(null);
      try {
        console.log("🔍 Fetching booking data for ID:", bookingId);
        
        // Try multiple endpoints
        let resp;
        const endpoints = [
          `/bookings/${bookingId}`,
          `/bookings/booking/${bookingId}`,
          `/bookings/id/${bookingId}`
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`🔄 Trying endpoint: ${endpoint}`);
            resp = await axios.get(endpoint);
            console.log(`✅ Success with endpoint: ${endpoint}`, resp.data);
            break;
          } catch (err) {
            console.log(`❌ Failed with endpoint: ${endpoint}`, err.message);
            continue;
          }
        }
        
        if (!resp) {
          throw new Error("All endpoints failed - please check if backend is running and booking exists");
        }
        
        console.log("📦 Full API response:", resp);
        console.log("📦 Response data:", resp.data);
        
        // Handle different response structures
        let payload = resp?.data;
        let resolved = payload?.data ?? payload?.booking ?? payload;

        if (!resolved && Array.isArray(payload)) {
          resolved = payload[0];
        }
        
        // Handle the specific structure from getBookingById: { message: "...", data: booking }
        if (!resolved && payload?.message && payload?.data) {
          resolved = payload.data;
        }

        if (!cancelled) {
          if (resolved) {
            console.log("🎯 Setting booking data:", resolved);
            console.log("👨‍🌾 Farmer data:", resolved.farmer || resolved.farmerId);
            console.log("🌱 Varieties data:", resolved.varieties);
            setBookingData(resolved);
          } else {
            console.error("❌ No data resolved from API response");
            setError("No booking data found in the response");
          }
        }
      } catch (err) {
        console.error("💥 Invoice fetch error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Unknown error";
        setError(`Failed to load invoice: ${errorMsg}`);
      } finally {
        if (!cancelled) setFetching(false);
      }
    };

    fetchInvoiceData();
    return () => {
      cancelled = true;
    };
  }, [isOpen, bookingId]);

  // PDF Generation
  const downloadPdf = async () => {
    setLoading(true);
    try {
      // Check if libraries are available
      let html2canvas, jsPDF;
      try {
        html2canvas = (await import("html2canvas")).default;
        const jsPDFModule = await import("jspdf");
        jsPDF = jsPDFModule.jsPDF;
      } catch (importError) {
        console.error('PDF libraries not available:', importError);
        alert('PDF generation libraries are not installed. Please install html2canvas and jspdf packages.');
        return;
      }

      if (!invoiceRef.current) {
        throw new Error("Invoice content not found for PDF generation");
      }

      // Create a clone for PDF generation to avoid affecting the display
      const element = invoiceRef.current;
      const clone = element.cloneNode(true);
      
      // Apply PDF-specific styles
      clone.style.width = "800px";
      clone.style.padding = "24px";
      clone.style.backgroundColor = "white";
      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      document.body.appendChild(clone);

      console.log("🖨️ Generating PDF...");

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 800,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 40; // 20px margin on each side
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);

      // Generate filename
      const invoiceNo = bookingData?.invoiceNo || `invoice-${Date.now().toString().slice(-6)}`;
      const fileName = `${invoiceNo}-${type}-${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}.pdf`;

      console.log("💾 Saving PDF as:", fileName);
      pdf.save(fileName);
      
    } catch (err) {
      console.error("💥 PDF generation failed:", err);
      const shouldTryPrint = window.confirm(`PDF generation failed: ${err.message}\n\nWould you like to try printing instead?`);
      if (shouldTryPrint) {
        window.print();
      }
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  // Print function as fallback
  const printInvoice = () => {
    window.print();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        disabled={!bookingId}
      >
        {type === "raw" ? "Raw Bill" : "Final Bill"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/40"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />

          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-preview-title"
            className="relative z-10 max-w-6xl w-full mx-auto bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 id="invoice-preview-title" className="text-xl font-semibold text-gray-800">
                बिलाचा पूर्वावलोकन / Invoice Preview - {type === "raw" ? "Raw Bill" : "Final Bill"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              <div className="flex justify-center">
                <div ref={invoiceRef} className="bg-white shadow-lg">
                  {fetching ? (
                    <div className="p-8 text-center text-gray-600">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      बिलाचा डेटा लोड होत आहे... / Loading invoice data...
                    </div>
                  ) : error ? (
                    <div className="p-6 text-red-600 bg-red-50 rounded-lg max-w-2xl">
                      <div className="font-semibold mb-2">त्रुटी / Error</div>
                      {error}
                      <div className="mt-4 text-sm">
                        <p>Booking ID: {bookingId}</p>
                        <p>Please check:</p>
                        <ul className="list-disc list-inside mt-2">
                          <li>Backend API endpoints</li>
                          <li>Booking data structure</li>
                          <li>Network connectivity</li>
                        </ul>
                      </div>
                    </div>
                  ) : bookingData ? (
                    <InvoiceContent booking={bookingData} type={type} />
                  ) : (
                    <div className="p-6 text-gray-500">No booking data available</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              >
                रद्द करा / Cancel
              </button>
              <button
                onClick={printInvoice}
                disabled={fetching || !!error || !bookingData}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                प्रिंट करा / Print
              </button>
              <button
                onClick={downloadPdf}
                disabled={loading || fetching || !!error || !bookingData}
                className="px-5 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              >
                {loading ? "PDF तयार होत आहे... / Generating PDF..." : "PDF डाउनलोड करा / Download PDF"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}