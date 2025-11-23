"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUserCircle,
  FaUserTie,
  FaUserShield,
  FaWhatsapp,
  FaPhoneAlt,
  FaTree,
  FaTint,
  FaLeaf,
  FaSun,
  FaTools,
  FaMapMarkerAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaBars,
  FaPaperclip,
} from "react-icons/fa"

const styles = `
:root {
    --primary: #1B5E20;
    --secondary: #8BC34A;
    --accent: #A1887F;
    --background: #F7FBF6;
    --text: #223322;
    --white: #ffffff;
    --light-gray: #f5f5f5;
    --gray: #e0e0e0;
    --dark-gray: #757575;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    font-family: 'Inter', sans-serif;
    color: var(--text);
    background-color: var(--background);
    line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    color: var(--primary);
    line-height: 1.3;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.section {
    padding: 80px 0;
}

.section-header {
    text-align: center;
    margin-bottom: 60px;
}

.section-header h2 {
    font-size: 2.5rem;
    margin-bottom: 15px;
}

.section-header p {
    font-size: 1.1rem;
    color: var(--dark-gray);
    max-width: 700px;
    margin: 0 auto;
}

.btn {
    display: inline-block;
    padding: 12px 30px;
    border-radius: 4px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
}

.btn-primary {
    background-color: var(--primary);
    color: var(--white);
}

.btn-primary:hover {
    background-color: #144017;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(27, 94, 32, 0.2);
}

.btn-secondary {
    background-color: var(--secondary);
    color: var(--white);
}

.btn-secondary:hover {
    background-color: #7cb342;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(139, 195, 74, 0.2);
}

.btn-outline {
    background-color: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
}

.btn-outline:hover {
    background-color: var(--primary);
    color: var(--white);
    transform: translateY(-3px);
}

/* Header */
header {
    background-color: var(--white);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

header.sticky {
    padding: 10px 0;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    transition: all 0.3s ease;
}

.logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 12px;
}

.logo-img {
    height: 55px;
    width: auto;
    object-fit: contain;
}

.logo-text {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--primary);
    display: none;
}

@media (min-width: 768px) {
    .logo-text {
        display: block;
    }
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.nav-links {
    display: flex;
    list-style: none;
}

.nav-links li {
    margin-left: 30px;
}

.nav-links a {
    text-decoration: none;
    color: var(--text);
    font-weight: 500;
    transition: color 0.3s;
    position: relative;
}

.nav-links a:hover, .nav-links a.active {
    color: var(--primary);
}

.nav-links a.active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: var(--primary);
}

.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--primary);
    cursor: pointer;
}

.login-area {
    position: relative;
}

.login-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    border-radius: 30px;
    font-size: 0.95rem;
}

.login-dropdown {
    position: absolute;
    right: 0;
    top: 120%;
    background: var(--white);
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    z-index: 1100;
}

.login-option {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    cursor: pointer;
    background: var(--light-gray);
    color: var(--primary);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
}

.login-option-icon {
    font-size: 1.4rem;
    margin-bottom: 4px;
}

.login-option.staff:hover {
    background: var(--secondary);
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(139, 195, 74, 0.4);
}

.login-option.admin:hover {
    background: var(--primary);
    color: #fff;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(27, 94, 32, 0.4);
}

/* Hero Section */
.hero {
    background: linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.6)),
      url('/src/assets/plant-nursery.jpg') center/cover no-repeat;
    background-attachment: fixed;
    min-height: 100vh;
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--white);
    padding: 100px 0 60px;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero h1 {
    font-size: 3.5rem;
    margin-bottom: 20px;
    line-height: 1.2;
    color: var(--white);
}

.hero p {
    font-size: 1.2rem;
    margin-bottom: 30px;
    opacity: 0.9;
}

.hero-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;
}

.whatsapp-quick {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background-color: #25D366;
    color: white;
    padding: 10px 20px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
}

.whatsapp-quick:hover {
    background-color: #128C7E;
    transform: translateY(-3px);
}

/* About Section */
.about-content {
    display: flex;
    align-items: center;
    gap: 50px;
}

.about-img {
    flex: 1;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
    background: #000;
}

.about-img::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top right, rgba(0,0,0,0.35), transparent 55%);
    pointer-events: none;
}

.about-img img {
    width: 100%;
    height: 100%;
    max-height: 420px;
    object-fit: cover;
    display: block;
    transform: scale(1.03);
    transition: transform 0.6s ease;
}

.about-img:hover img {
    transform: scale(1.08);
}

.about-text {
    flex: 1;
}

.about-text h3 {
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: var(--primary);
}

.about-text p {
    margin-bottom: 20px;
    color: var(--text);
}

.certifications {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin: 25px 0;
}

.cert-badge {
    background-color: var(--light-gray);
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--primary);
}

.stats {
    display: flex;
    gap: 30px;
    margin-top: 30px;
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 5px;
}

.stat-text {
    font-size: 0.9rem;
    color: var(--dark-gray);
}

/* Services Section */
.services {
    background-color: var(--light-gray);
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.service-card {
    background: var(--white);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s;
    padding: 30px;
    text-align: center;
}

.service-card:hover {
    transform: translateY(-10px);
}

.service-icon {
    font-size: 3rem;
    color: var(--primary);
    margin-bottom: 20px;
}

.service-card h3 {
    margin-bottom: 15px;
    color: var(--primary);
}

.service-card p {
    color: var(--text);
}

/* Gallery Filters */
.gallery-filters {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.gallery-filter-btn {
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid var(--gray);
    background: var(--white);
    font-size: 0.95rem;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.3s ease;
}

.gallery-filter-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.gallery-filter-btn.active {
    background: var(--primary);
    border-color: var(--primary);
    color: #fff;
}

/* Gallery Section */
.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 25px;
}

.gallery-card {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    height: 260px;
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.18);
    background: #000;
    cursor: zoom-in;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.gallery-card:hover {
    transform: scale(1.1);
    box-shadow: 0 18px 35px rgba(0, 0, 0, 0.35);
    z-index: 5;
}

.gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.02);
    transition: transform 0.8s ease, filter 0.5s ease;
    filter: saturate(1.05) contrast(1.02);
}

.gallery-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent 55%);
    opacity: 1;
    pointer-events: none;
}

.gallery-card:hover .gallery-image {
    transform: scale(1.18);
    filter: saturate(1.2) contrast(1.05);
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 18px 20px 16px;
    color: #fff;
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: translateY(0);
    opacity: 1;
}

.gallery-overlay h4 {
    font-size: 1.05rem;
    margin-bottom: 4px;
}

.gallery-overlay p {
    font-size: 0.9rem;
    opacity: 0.9;
}

/* Fullscreen Lightbox */
.lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2100;
}

.lightbox-inner {
    max-width: 90vw;
    max-height: 90vh;
    position: relative;
}

.lightbox-image {
    max-width: 100%;
    max-height: 80vh;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.7);
    object-fit: contain;
}

.lightbox-caption {
    margin-top: 10px;
    color: #fff;
    text-align: center;
    font-size: 0.95rem;
}

.lightbox-close {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(0,0,0,0.7);
    color: #fff;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Testimonials Section */
.testimonials {
    background-color: var(--light-gray);
}

.testimonials-slider {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

.testimonial-item {
    background: var(--white);
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    text-align: center;
}

.testimonial-text {
    font-style: italic;
    margin-bottom: 20px;
    color: var(--text);
}

.testimonial-author {
    font-weight: 600;
    color: var(--primary);
}

.testimonial-role {
    font-size: 0.9rem;
    color: var(--dark-gray);
}

/* Contact Section */
.contact-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 40px;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.contact-item i,
.contact-icon {
    font-size: 1.5rem;
    color: var(--primary);
    margin-top: 5px;
}

.contact-item h4 {
    margin-bottom: 5px;
    color: var(--primary);
}

.business-hours {
    margin-top: 20px;
}

.business-hours h4 {
    margin-bottom: 15px;
}

.hours-list {
    list-style: none;
}

.hours-list li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--gray);
}

.contact-form {
    background: var(--white);
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.form-group {
    margin-bottom: 20px;
}

.form-control {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border 0.3s;
    font-family: 'Inter', sans-serif;
}

.form-control:focus {
    border-color: var(--primary);
    outline: none;
}

textarea.form-control {
    min-height: 150px;
    resize: vertical;
}

.file-upload {
    position: relative;
    overflow: hidden;
    display: inline-block;
    width: 100%;
}

.file-upload-btn {
    background-color: var(--light-gray);
    color: var(--text);
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: center;
    border: 1px dashed var(--dark-gray);
}

.file-upload input[type="file"] {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

.map-container {
    margin-top: 40px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.map-container iframe {
    width: 100%;
    height: 400px;
    border: none;
}

/* Footer */
footer {
    background: var(--primary);
    color: var(--white);
    padding: 60px 0 0;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-bottom: 40px;
}

.footer-column h4 {
    margin-bottom: 20px;
    font-size: 1.3rem;
    color: var(--white);
}

.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: 10px;
}

.footer-links a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-links a:hover {
    color: var(--secondary);
}

.social-links {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.social-links a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--white);
    border-radius: 50%;
    text-decoration: none;
    transition: all 0.3s;
}

.social-links a:hover {
    background: var(--secondary);
    transform: translateY(-3px);
}

.copyright {
    background: rgba(0, 0, 0, 0.2);
    padding: 20px 0;
    text-align: center;
    color: #ccc;
    font-size: 0.9rem;
}

.copyright a {
    color: #ffeb3b;
    text-decoration: none;
}

.copyright a:hover {
    text-decoration: underline;
}

/* Floating Action Buttons */
.floating-buttons {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.floating-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
    text-decoration: none;
    position: relative;
}

.floating-btn:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.whatsapp-btn {
    background: #25D366;
}

.call-btn {
    background: var(--primary);
}

.floating-btn .tooltip {
    position: absolute;
    right: 70px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
}

.floating-btn:hover .tooltip {
    opacity: 1;
}

/* Toast Notification */
.toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: white;
    padding: 15px 25px;
    border-radius: 4px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    opacity: 0;
    transition: opacity 0.3s;
}

.toast.show {
    opacity: 1;
}

/* Loader Overlay - enhanced natural look */
.loader-overlay {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at top, #b3e5fc 0%, #81d4fa 28%, #a5d6a7 60%, #388e3c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.loader-content {
    text-align: center;
    color: #fff;
}

.loader-farm {
    position: relative;
    width: 220px;
    height: 150px;
    margin: 0 auto 20px;
}

/* Sky layer */
.loader-sky {
    position: absolute;
    inset: 0 0 35%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(129,212,250,0.1));
    border-radius: 40px 40px 0 0;
    overflow: hidden;
}

/* Hills */
.loader-hill {
    position: absolute;
    bottom: 20px;
    width: 200px;
    height: 70px;
    background: radial-gradient(circle at 50% 0%, #66bb6a 0%, #388e3c 60%, #2e7d32 100%);
    border-radius: 50% 50% 10px 10px;
    filter: blur(0.4px);
}

.loader-hill-1 {
    left: -10px;
}

.loader-hill-2 {
    left: 10px;
    bottom: 10px;
    opacity: 0.85;
}

/* Field with crops */
.loader-field {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 190px;
    height: 70px;
    background: linear-gradient(180deg, #8bc34a 0%, #558b2f 100%);
    border-radius: 50px 50px 14px 14px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.loader-crop {
    position: absolute;
    bottom: 4px;
    width: 6px;
    height: 40px;
    background: #2e7d32;
    border-radius: 50px;
    transform-origin: bottom center;
    animation: cropGrow 1.4s ease-in-out infinite;
}

.loader-crop::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -6px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #a5d6a7;
}

.loader-crop-1 {
    left: 30px;
    animation-delay: 0s;
}

.loader-crop-2 {
    left: 75px;
    animation-delay: 0.25s;
}

.loader-crop-3 {
    left: 120px;
    animation-delay: 0.5s;
}

.loader-crop-4 {
    left: 150px;
    animation-delay: 0.75s;
}

/* Sun */
.loader-sun {
    position: absolute;
    top: -5px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #ffeb3b;
    box-shadow: 0 0 25px rgba(255, 235, 59, 0.9);
    animation: sunPulse 1.8s ease-in-out infinite;
}

/* Clouds */
.loader-cloud {
    position: absolute;
    top: 10px;
    width: 55px;
    height: 22px;
    background: rgba(255,255,255,0.95);
    border-radius: 22px;
    filter: blur(0.3px);
}

.loader-cloud::before,
.loader-cloud::after {
    content: '';
    position: absolute;
    background: inherit;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    top: -10px;
}

.loader-cloud::before {
    left: 5px;
}

.loader-cloud::after {
    right: 5px;
}

.loader-cloud-1 {
    left: 10px;
    animation: cloudDrift 9s linear infinite;
}

.loader-cloud-2 {
    right: -5px;
    top: 22px;
    transform: scale(0.9);
    animation: cloudDrift 11s linear infinite reverse;
}

.loader-text {
    font-family: 'Poppins', sans-serif;
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    animation: textBounce 1.2s ease-in-out infinite;
}

/* Loader Animations */
@keyframes cropGrow {
    0% {
        transform: scaleY(0.25);
        opacity: 0.5;
    }
    50% {
        transform: scaleY(1);
        opacity: 1;
    }
    100% {
        transform: scaleY(0.25);
        opacity: 0.5;
    }
}

@keyframes sunPulse {
    0%, 100% {
        transform: scale(1);
        opacity: 0.95;
    }
    50% {
        transform: scale(1.12);
        opacity: 1;
    }
}

@keyframes textBounce {
    0%, 100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-8px);
    }
    60% {
        transform: translateY(0);
    }
}

@keyframes cloudDrift {
    0% {
        transform: translateX(-10px);
    }
    50% {
        transform: translateX(15px);
    }
    100% {
        transform: translateX(-10px);
    }
}

/* Responsive */
@media (max-width: 992px) {
    .about-content {
        flex-direction: column;
    }

    .about-img {
        max-width: 100%;
    }
    
    .hero h1 {
        font-size: 2.8rem;
    }

    .stats {
        justify-content: center;
    }
}

@media (max-width: 768px) {
    .mobile-menu-btn {
        display: block;
    }
    
    .nav-links {
        position: fixed;
        top: 80px;
        left: -100%;
        width: 100%;
        height: calc(100vh - 80px);
        background: var(--white);
        flex-direction: column;
        align-items: center;
        padding-top: 50px;
        transition: left 0.3s;
    }
    
    .nav-links.active {
        left: 0;
    }
    
    .nav-links li {
        margin: 15px 0;
    }
    
    .hero h1 {
        font-size: 2.2rem;
    }

    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }

    .section {
        padding: 60px 0;
    }
    
    .floating-buttons {
        bottom: 20px;
        right: 20px;
    }
    
    .floating-btn {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }

    .nav-right {
        gap: 10px;
    }

    .login-dropdown {
        right: 10px;
    }

    .loader-text {
        font-size: 1.3rem;
    }

    .gallery-card {
        height: 220px;
    }
}
`

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Jay Kisan Hi-Tech Nursery",
  description:
    "Premium saplings, hydroponic systems, and expert gardening consultation with certified greenhouse solutions by Jay Kisan Hi-Tech Nursery.",
  url: "https://jaykirannursery.com",
  telephone: "+91-9876543210",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Green Valley Road",
    addressLocality: "Pune",
    addressRegion: "Maharashtra",
    postalCode: "411045",
    addressCountry: "IN",
  },
  openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-16:00",
  areaServed: "Maharashtra",
}

// gallery images – you can change these paths to your own
const galleryImages = {
  crop: [
    {
      src: "/assets/Crop.jpg",
      title: "Crop Tunnel",
      caption: "Healthy crops growing under controlled conditions.",
    },
    {
      src: "/src/assets/Crop1.jpg",
      title: "Field Crops",
      caption: "Wide-open field with lush seasonal crops.",
    },
    {
      src: "/src/assets/crop2.jpg",
      title: "Mixed Crop Area",
      caption: "Different varieties managed in one block.",
    },
    {
      src: "/src/assets/crop3.jpg",
      title: "Row Crop Layout",
      caption: "Perfect row spacing for best growth and yield.",
    },
  ],
  tray: [
    {
      src: "/src/assets/tray1.jpg",
      title: "Tray Seedlings",
      caption: "Uniform saplings ready to be transplanted.",
    },
    {
      src: "/src/assets/tray2.jpg",
      title: "Nursery Trays",
      caption: "Well-rooted plants in high quality trays.",
    },
    {
      src: "/src/assets/tray3.jpg",
      title: "Sprout Trays",
      caption: "Early stage seedlings under close monitoring.",
    },
    {
      src: "/src/assets/tray4.jpg",
      title: "Hydrated Trays",
      caption: "Regular watering ensures even growth in all cells.",
    },
  ],
  farm: [
    {
      src: "/src/assets/farm.jpg",
      title: "Main Farm Area",
      caption: "Large scale plantation with proper irrigation.",
    },
    {
      src: "/src/assets/farm1.jpg",
      title: "Farm Walkway",
      caption: "Walkways designed for easy access and care.",
    },
    {
      src: "/src/assets/farm2.jpg",
      title: "Open Farm View",
      caption: "Open sky, clean air and healthy plants everywhere.",
    },
  ],
}

const LandingPage = () => {
  const [showLoginMenu, setShowLoginMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lightboxImage, setLightboxImage] = useState(null)
  const [activeGalleryCategory, setActiveGalleryCategory] = useState("crop")
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const navLinks = document.querySelector(".nav-links")

    const handleMobileMenuClick = () => {
      if (navLinks) navLinks.classList.toggle("active")
    }

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", handleMobileMenuClick)
    }

    const header = document.querySelector("header")
    const handleScrollSticky = () => {
      if (!header) return
      if (window.scrollY > 100) {
        header.classList.add("sticky")
      } else {
        header.classList.remove("sticky")
      }
    }

    window.addEventListener("scroll", handleScrollSticky)

    const anchorLinks = document.querySelectorAll('a[href^="#"]')

    const handleAnchorClick = (e) => {
      e.preventDefault()
      const targetId = e.currentTarget.getAttribute("href")
      if (!targetId || targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        if (navLinks) navLinks.classList.remove("active")
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        })
      }
    }

    anchorLinks.forEach((anchor) => anchor.addEventListener("click", handleAnchorClick))

    const sections = document.querySelectorAll("section")
    const navLinksAnchors = document.querySelectorAll(".nav-links a")

    const handleScrollActiveLink = () => {
      let current = ""
      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute("id") || ""
        }
      })

      navLinksAnchors.forEach((link) => {
        link.classList.remove("active")
        const href = link.getAttribute("href")
        if (href === `#${current}`) {
          link.classList.add("active")
        }
      })
    }

    window.addEventListener("scroll", handleScrollActiveLink)

    const contactForm = document.getElementById("contactForm")
    const toast = document.getElementById("successToast")

    const handleContactSubmit = (e) => {
      e.preventDefault()
      if (toast) {
        toast.classList.add("show")
        setTimeout(() => {
          toast.classList.remove("show")
        }, 3000)
      }
      if (contactForm) {
        contactForm.reset()
      }
    }

    if (contactForm) {
      contactForm.addEventListener("submit", handleContactSubmit)
    }

    const counters = document.querySelectorAll(".stat-number")
    const speed = 200

    const animateCounter = () => {
      counters.forEach((counter) => {
        const target = Number(counter.getAttribute("data-count") || "0")
        const count = Number(counter.innerHTML || "0")
        const increment = target / speed

        if (count < target) {
          counter.innerHTML = String(Math.ceil(count + increment))
          setTimeout(animateCounter, 1)
        } else {
          counter.innerHTML = String(target)
        }
      })
    }

    const aboutSection = document.getElementById("about")
    let observer
    if (aboutSection) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter()
              if (observer) observer.unobserve(aboutSection)
            }
          })
        },
        { threshold: 0.5 },
      )

      observer.observe(aboutSection)
    }

    return () => {
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener("click", handleMobileMenuClick)
      }
      window.removeEventListener("scroll", handleScrollSticky)
      window.removeEventListener("scroll", handleScrollActiveLink)
      anchorLinks.forEach((anchor) => anchor.removeEventListener("click", handleAnchorClick))
      if (contactForm) {
        contactForm.removeEventListener("submit", handleContactSubmit)
      }
      if (observer && aboutSection) {
        observer.unobserve(aboutSection)
      }
    }
  }, [])

  const currentGalleryImages = galleryImages[activeGalleryCategory] || []

  return (
    <>
      <style>{styles}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />

      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-content">
            <div className="loader-farm">
              <div className="loader-sky">
                <div className="loader-cloud loader-cloud-1" />
                <div className="loader-cloud loader-cloud-2" />
              </div>
              <div className="loader-hill loader-hill-1" />
              <div className="loader-hill loader-hill-2" />
              <div className="loader-field">
                <div className="loader-crop loader-crop-1" />
                <div className="loader-crop loader-crop-2" />
                <div className="loader-crop loader-crop-3" />
                <div className="loader-crop loader-crop-4" />
              </div>
              <div className="loader-sun" />
            </div>
            <div className="loader-text">Jay Kisan Hi-Tech Nursery</div>
          </div>
        </div>
      )}

      <header>
        <div className="container">
          <nav className="navbar">
            <a href="#home" className="logo">
              <img src="/src/assets/logo.png" alt="Jay Kisan Hi-Tech Nursery Logo" className="logo-img" />
              <span className="logo-text">Jay Kisan Hi-Tech Nursery</span>
            </a>

            <div className="nav-right">
              <ul className="nav-links">
                <li>
                  <a href="#home" className="active">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#gallery">Gallery</a>
                </li>
                <li>
                  <a href="#testimonials">Testimonials</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>

              <div className="login-area">
                <button
                  type="button"
                  className="btn btn-outline login-btn"
                  onClick={() => setShowLoginMenu((prev) => !prev)}
                >
                  <FaUserCircle />
                  <span>Login</span>
                </button>

                {showLoginMenu && (
                  <div className="login-dropdown">
                    <button
                      type="button"
                      className="login-option staff"
                      onClick={() => navigate("/login", { state: { role: "staff" } })}
                    >
                      <FaUserTie className="login-option-icon" />
                      <span>Staff</span>
                    </button>
                    <button
                      type="button"
                      className="login-option admin"
                      onClick={() => navigate("/login", { state: { role: "admin" } })}
                    >
                      <FaUserShield className="login-option-icon" />
                      <span>Admin</span>
                    </button>
                  </div>
                )}
              </div>

              <button className="mobile-menu-btn" aria-label="Toggle navigation">
                <FaBars />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Premium Saplings &amp; Hi-Tech Greenhouse Solutions</h1>
            <p>
              Jay Kisan Hi-Tech Nursery offers certified saplings, hydroponic systems, and expert gardening consultation
              with 15+ years of expertise.
            </p>
            <div className="hero-buttons">
              <a href="#gallery" className="btn btn-primary">
                View Gallery
              </a>
            </div>
            <a href="https://wa.me/918999835934" className="whatsapp-quick" target="_blank" rel="noreferrer">
              <FaWhatsapp />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container">
          <div className="section-header">
            <h2>About Jay Kisan Hi-Tech Nursery</h2>
            <p>
              With over 15 years of expertise in hi-tech horticulture, we're leaders in sustainable plant cultivation
              and greenhouse technology.
            </p>
          </div>
          <div className="about-content">
            <div className="about-img">
              <img src="/src/assets/FarmBanner.jpg" alt="Jay Kisan Hi-Tech Nursery greenhouse" />
            </div>
            <div className="about-text">
              <h3>Our Story &amp; Technical Edge</h3>
              <p>
                Founded in 2008, Jay Kisan Hi-Tech Nursery has pioneered advanced cultivation techniques in Western
                India. Our focus on research-driven methods ensures the highest quality saplings for both commercial and
                home gardeners.
              </p>
              <p>
                We specialize in hydroponics, aeroponics, and tissue culture propagation, allowing us to produce
                disease-resistant, high-yield plants year-round.
              </p>

              <div className="certifications">
                <span className="cert-badge">ISO 9001 Certified</span>
                <span className="cert-badge">GAP Certified</span>
                <span className="cert-badge">NABARD Approved</span>
                <span className="cert-badge">Organic Certified</span>
              </div>

              <div className="stats">
                <div className="stat-item">
                  <div className="stat-number" data-count="15">
                    0
                  </div>
                  <div className="stat-text">Years Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-count="500">
                    0
                  </div>
                  <div className="stat-text">Plant Varieties</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-count="10000">
                    0
                  </div>
                  <div className="stat-text">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive horticultural solutions from premium saplings to complete greenhouse setups.</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <FaTree />
              </div>
              <h3>Premium Saplings</h3>
              <p>
                Certified fruit, ornamental, and medicinal plant saplings with high survival rates and genetic purity.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <FaTint />
              </div>
              <h3>Hydroponic Systems</h3>
              <p>Custom hydroponic setups for efficient water use and higher yields in limited spaces.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <FaLeaf />
              </div>
              <h3>Tissue Culture</h3>
              <p>Advanced tissue culture labs for mass propagation of disease-free, genetically uniform plants.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <FaSun />
              </div>
              <h3>Greenhouse Solutions</h3>
              <p>Design and installation of hi-tech greenhouses with climate control and automation systems.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <FaUserTie />
              </div>
              <h3>Consulting Services</h3>
              <p>Expert advice on crop selection, cultivation practices, and greenhouse management.</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <FaTools />
              </div>
              <h3>Maintenance &amp; Support</h3>
              <p>Regular maintenance services and technical support for all our installations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery with 3 category buttons: Crop, Tray, Farm */}
      <section id="gallery" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Gallery</h2>
            <p>View our nursery, trays, and farm areas category wise.</p>
          </div>

          <div className="gallery-filters">
            <button
              type="button"
              className={`gallery-filter-btn ${activeGalleryCategory === "crop" ? "active" : ""}`}
              onClick={() => setActiveGalleryCategory("crop")}
            >
              Crop
            </button>
            <button
              type="button"
              className={`gallery-filter-btn ${activeGalleryCategory === "tray" ? "active" : ""}`}
              onClick={() => setActiveGalleryCategory("tray")}
            >
              Tray
            </button>
            <button
              type="button"
              className={`gallery-filter-btn ${activeGalleryCategory === "farm" ? "active" : ""}`}
              onClick={() => setActiveGalleryCategory("farm")}
            >
              Farm
            </button>
          </div>

          <div className="gallery-grid">
            {currentGalleryImages.map((img, index) => (
              <div
                key={`${activeGalleryCategory}-${index}`}
                className="gallery-card"
                onClick={() => setLightboxImage(img)}
              >
                <img className="gallery-image" src={img.src} alt={img.title} />
                <div className="gallery-overlay">
                  <h4>{img.title}</h4>
                  <p>{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox overlay for max-size image */}
      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImage(null)} aria-label="Close image view">
              &times;
            </button>
            <img src={lightboxImage.src} alt={lightboxImage.title} className="lightbox-image" />
            <div className="lightbox-caption">
              <strong>{lightboxImage.title}</strong>
              <div>{lightboxImage.caption}</div>
            </div>
          </div>
        </div>
      )}

      <section id="testimonials" className="section testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Clients Say</h2>
            <p>Trusted by farmers, landscapers, and gardening enthusiasts across India.</p>
          </div>

          <div className="testimonials-slider">
            <div className="testimonial-item">
              <div className="testimonial-text">
                "Jay Kisan Hi-Tech Nursery provided us with excellent quality mango saplings. Their technical guidance
                helped us increase yield by 30% in the first year itself."
              </div>
              <div className="testimonial-author">Sachin Thete</div>
              <div className="testimonial-role">Director, SachiTech</div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Contact us for quotes, consultations, or any gardening questions.</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h4>Our Nursery</h4>
                  <p>Nagalwadi, Road, Dhondegaon, Girnare, Maharashtra 422203</p>
                </div>
              </div>

              <div className="contact-item">
                <FaPhoneAlt className="contact-icon" />
                <div>
                  <h4>Call Us</h4>
                  <p>+91-8999835934</p>
                </div>
              </div>

              <div className="contact-item">
                <FaWhatsapp className="contact-icon" />
                <div>
                  <h4>WhatsApp</h4>
                  <p>+91-8999835934</p>
                </div>
              </div>

              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h4>Email Us</h4>
                  <p>info@jaykisannursery.com</p>
                </div>
              </div>

              <div className="business-hours">
                <h4>Business Hours</h4>
                <ul className="hours-list">
                  <li>
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </li>
                  <li>
                    <span>Saturday</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </li>
                  <li>
                    <span>Sunday</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="contact-form">
              <form id="contactForm">
                <div className="form-group">
                  <input type="text" className="form-control" placeholder="Your Name" required aria-label="Your Name" />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    required
                    aria-label="Your Email"
                  />
                </div>

                <div className="form-group">
                  <input type="tel" className="form-control" placeholder="Your Phone" aria-label="Your Phone" />
                </div>

                <div className="form-group">
                  <select className="form-control" aria-label="Service Interest">
                    <option value="">I'm interested in...</option>
                    <option value="saplings">Premium Saplings</option>
                    <option value="hydroponics">Hydroponic Systems</option>
                    <option value="greenhouse">Greenhouse Setup</option>
                    <option value="consultation">Gardening Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <textarea
                    className="form-control"
                    placeholder="Your Message"
                    required
                    aria-label="Your Message"
                  ></textarea>
                </div>

                <div className="form-group">
                  <div className="file-upload">
                    <div className="file-upload-btn">
                      <FaPaperclip />
                      Attach files (optional)
                    </div>
                    <input type="file" aria-label="Attach files" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.842918572298!2d73.6516936!3d20.0677588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddf1a65fd6dd49:0xd0994caccfa3559a!2sJay+Kisan+Hitech+Nursery!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              aria-label="Jay Kisan Hi-Tech Nursery location map"
              title="Jay Kisan Hi-Tech Nursery map"
            ></iframe>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h4>Jay Kisan Hi-Tech Nursery</h4>
              <p>
                Premium saplings, hydroponic systems, and expert gardening consultation with certified greenhouse
                solutions.
              </p>
              <div className="social-links">
                <a href="#!" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="#!" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#!" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#!" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
            </div>

            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#gallery">Gallery</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Our Services</h4>
              <ul className="footer-links">
                <li>
                  <a href="#!">Premium Saplings</a>
                </li>
                <li>
                  <a href="#!">Hydroponic Systems</a>
                </li>
                <li>
                  <a href="#!">Greenhouse Solutions</a>
                </li>
                <li>
                  <a href="#!">Gardening Consultation</a>
                </li>
                <li>
                  <a href="#!">Maintenance &amp; Support</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Newsletter</h4>
              <p>Subscribe for gardening tips and exclusive offers.</p>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email"
                  aria-label="Your email for newsletter"
                />
              </div>
              <button className="btn btn-secondary">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="copyright">
          <div className="container">
            <p>&copy; 2023 Jay Kisan Hi-Tech Nursery. All rights reserved.</p>
            <p>
              Website designed by{" "}
              <a href="https://www.teamwala.in" target="_blank" rel="noreferrer">
                TeamWala
              </a>{" "}
              (www.teamwala.in)
            </p>
          </div>
        </div>
      </footer>

      <div className="floating-buttons">
        <a
          href="https://wa.me/918999835934"
          className="floating-btn whatsapp-btn"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp />
          <span className="tooltip">Chat on WhatsApp</span>
        </a>
        <a href="tel:+918999835934" className="floating-btn call-btn" aria-label="Call us">
          <FaPhoneAlt />
          <span className="tooltip">Call Us Now</span>
        </a>
      </div>

      <div className="toast" id="successToast">
        Thank you! Your message has been sent successfully.
      </div>
    </>
  )
}

export default LandingPage
