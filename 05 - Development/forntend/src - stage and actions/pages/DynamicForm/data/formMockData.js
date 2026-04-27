// src/mock/formMockData.js
// Feed any of these directly to <FormRenderer formData={MOCK_FORMS.enquiry} />

import { v4 as uuidv4 } from 'uuid';

// ── Helper ────────────────────────────────────────────────────────────────────
const field = (overrides) => ({
  id: uuidv4(),
  name: '',
  label: '',
  type: 'text',
  placeholder: '',
  helpText: '',
  required: false,
  width: 'full',
  order: 0,
  validation: { minLength: '', maxLength: '', min: '', max: '', pattern: '' },
  options: [],
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// FORM 1: Customer Enquiry Form (Enquiry type)
// ─────────────────────────────────────────────────────────────────────────────
export const ENQUIRY_FORM = {
  id: 'mock-form-001',
  name: 'Product Enquiry Form',
  type: 'Enquiry',
  description: 'Fill in your details and we will get back to you within 24 working hours.',
  is_active: true,
  schema: {
    fields: [
      field({
        id: 'f1', name: 'full_name', label: 'Full Name', type: 'text',
        placeholder: 'Enter your full name', required: true, order: 0, width: 'half',
        validation: { minLength: 2, maxLength: 100 },
        helpText: 'As per official records',
      }),
      field({
        id: 'f2', name: 'designation', label: 'Designation', type: 'text',
        placeholder: 'e.g. General Manager – Procurement', required: false, order: 1, width: 'half',
      }),
      field({
        id: 'f3', name: 'email', label: 'Official Email Address', type: 'email',
        placeholder: 'you@organization.gov.in', required: true, order: 2, width: 'half',
      }),
      field({
        id: 'f4', name: 'phone', label: 'Contact Number', type: 'phone',
        placeholder: '+91 98765 43210', required: true, order: 3, width: 'half',
        validation: { minLength: 10, maxLength: 15 },
      }),
      field({
        id: 'f5', name: 'organization', label: 'Organization / Department', type: 'text',
        placeholder: 'e.g. Ministry of Defence, DRDO, ITBP', required: true, order: 4, width: 'full',
      }),
      field({
        id: 'f6', name: 'state', label: 'State', type: 'select',
        required: true, order: 5, width: 'half',
        options: [
          { label: 'Andhra Pradesh', value: 'andhra_pradesh' },
          { label: 'Delhi', value: 'delhi' },
          { label: 'Gujarat', value: 'gujarat' },
          { label: 'Karnataka', value: 'karnataka' },
          { label: 'Maharashtra', value: 'maharashtra' },
          { label: 'Rajasthan', value: 'rajasthan' },
          { label: 'Tamil Nadu', value: 'tamil_nadu' },
          { label: 'Telangana', value: 'telangana' },
          { label: 'Uttar Pradesh', value: 'uttar_pradesh' },
          { label: 'West Bengal', value: 'west_bengal' },
        ],
      }),
      field({
        id: 'f7', name: 'product_category', label: 'Product Category of Interest', type: 'select',
        required: true, order: 6, width: 'half',
        options: [
          { label: 'Surveillance & Radar Systems', value: 'radar' },
          { label: 'Communication Equipment', value: 'comms' },
          { label: 'Border Security Solutions', value: 'border' },
          { label: 'Night Vision Devices', value: 'nvd' },
          { label: 'Armoured Vehicles', value: 'armoured' },
          { label: 'Drones & UAV Systems', value: 'uav' },
          { label: 'Cyber Security Solutions', value: 'cyber' },
          { label: 'Other', value: 'other' },
        ],
      }),
      field({
        id: 'f8', name: 'requirement_type', label: 'Requirement Type', type: 'radio',
        required: true, order: 7, width: 'full',
        options: [
          { label: 'New Procurement', value: 'new' },
          { label: 'Replacement / Upgrade', value: 'upgrade' },
          { label: 'Annual Maintenance Contract (AMC)', value: 'amc' },
          { label: 'Demonstration / Trial', value: 'demo' },
        ],
      }),
      field({
        id: 'f9', name: 'budget_range', label: 'Estimated Budget Range', type: 'select',
        required: false, order: 8, width: 'half',
        options: [
          { label: 'Below ₹10 Lakhs', value: 'lt_10l' },
          { label: '₹10L – ₹1 Crore', value: '10l_1cr' },
          { label: '₹1 Crore – ₹10 Crore', value: '1cr_10cr' },
          { label: '₹10 Crore – ₹100 Crore', value: '10cr_100cr' },
          { label: 'Above ₹100 Crore', value: 'gt_100cr' },
          { label: 'Not Decided', value: 'tbd' },
        ],
      }),
      field({
        id: 'f10', name: 'timeline', label: 'Expected Procurement Timeline', type: 'select',
        required: false, order: 9, width: 'half',
        options: [
          { label: 'Immediate (within 3 months)', value: 'immediate' },
          { label: '3–6 months', value: '3_6m' },
          { label: '6–12 months', value: '6_12m' },
          { label: 'More than 1 year', value: 'gt_1yr' },
        ],
      }),
      field({
        id: 'f11', name: 'heard_via', label: 'How did you hear about us?', type: 'checkbox',
        required: false, order: 10, width: 'full',
        options: [
          { label: 'Defence Expo / Aero India', value: 'expo' },
          { label: 'Government Portal / GeM', value: 'gem' },
          { label: 'Referral from colleague', value: 'referral' },
          { label: 'LinkedIn / Social Media', value: 'social' },
          { label: 'Search Engine', value: 'search' },
          { label: 'News / Press Release', value: 'news' },
        ],
      }),
      field({
        id: 'f12', name: 'message', label: 'Detailed Requirement / Message', type: 'textarea',
        placeholder: 'Describe your requirement, quantity, specific features needed, etc.',
        required: true, order: 11, width: 'full',
        validation: { minLength: 20, maxLength: 2000 },
        helpText: 'Minimum 20 characters. More detail helps us respond accurately.',
      }),
      field({
        id: 'f13', name: 'tender_reference', label: 'Tender / RFP Reference No. (if any)', type: 'text',
        placeholder: 'e.g. MOD/2025/RFP/0421', required: false, order: 12, width: 'half',
      }),
      field({
        id: 'f14', name: 'document', label: 'Attach RFP / EOI Document (optional)', type: 'file',
        required: false, order: 13, width: 'half',
        helpText: 'PDF, DOC up to 10MB',
      }),
    ],
    settings: {
      submitLabel: 'Submit Enquiry',
      successMessage: 'Thank you for your enquiry. Our business development team will contact you within 24 working hours.',
      allowMultipleSubmissions: false,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM 2: Vendor / Supplier Registration Form
// ─────────────────────────────────────────────────────────────────────────────
export const VENDOR_REGISTRATION_FORM = {
  id: 'mock-form-002',
  name: 'Vendor & Supplier Registration',
  type: 'Vendor Registration',
  description: 'Register as an approved vendor/supplier. All fields marked * are mandatory.',
  is_active: true,
  schema: {
    fields: [
      field({ id: 'v1', name: 'company_name', label: 'Company Name', type: 'text', required: true, order: 0, width: 'full', placeholder: 'Registered company name', validation: { minLength: 2, maxLength: 200 } }),
      field({ id: 'v2', name: 'cin', label: 'CIN / LLPIN', type: 'text', required: true, order: 1, width: 'half', placeholder: 'e.g. U72900KA2010PTC052367', helpText: 'Ministry of Corporate Affairs registration number' }),
      field({ id: 'v3', name: 'gstin', label: 'GSTIN', type: 'text', required: true, order: 2, width: 'half', placeholder: 'e.g. 29ABCDE1234F1Z5', validation: { minLength: 15, maxLength: 15 } }),
      field({ id: 'v4', name: 'pan', label: 'PAN Number', type: 'text', required: true, order: 3, width: 'half', placeholder: 'e.g. ABCDE1234F', validation: { minLength: 10, maxLength: 10, pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' }, helpText: 'Company PAN as per Income Tax records' }),
      field({ id: 'v5', name: 'year_established', label: 'Year Established', type: 'number', required: true, order: 4, width: 'half', validation: { min: 1950, max: 2025 } }),
      field({ id: 'v6', name: 'contact_person', label: 'Primary Contact Person', type: 'text', required: true, order: 5, width: 'half', placeholder: 'Full name' }),
      field({ id: 'v7', name: 'contact_email', label: 'Contact Email', type: 'email', required: true, order: 6, width: 'half', placeholder: 'contact@company.com' }),
      field({ id: 'v8', name: 'contact_phone', label: 'Contact Phone', type: 'phone', required: true, order: 7, width: 'half' }),
      field({ id: 'v9', name: 'website', label: 'Company Website', type: 'text', required: false, order: 8, width: 'half', placeholder: 'https://www.company.com' }),
      field({
        id: 'v10', name: 'company_type', label: 'Company Type', type: 'select',
        required: true, order: 9, width: 'half',
        options: [
          { label: 'OEM (Original Equipment Manufacturer)', value: 'oem' },
          { label: 'System Integrator', value: 'si' },
          { label: 'Distributor / Reseller', value: 'distributor' },
          { label: 'Service Provider', value: 'service' },
          { label: 'Startup / MSME', value: 'msme' },
        ],
      }),
      field({
        id: 'v11', name: 'supply_categories', label: 'Categories You Supply', type: 'checkbox',
        required: true, order: 10, width: 'full',
        options: [
          { label: 'Defence Electronics', value: 'def_elec' },
          { label: 'IT & Cybersecurity', value: 'it_cyber' },
          { label: 'Communication Systems', value: 'comms' },
          { label: 'Mechanical / Structural', value: 'mech' },
          { label: 'Software & AI Solutions', value: 'software' },
          { label: 'Training & Simulation', value: 'training' },
          { label: 'MRO / Spare Parts', value: 'mro' },
        ],
      }),
      field({
        id: 'v12', name: 'turnover_range', label: 'Annual Turnover (last FY)', type: 'select',
        required: true, order: 11, width: 'half',
        options: [
          { label: 'Below ₹1 Crore', value: 'lt_1cr' },
          { label: '₹1–10 Crore', value: '1_10cr' },
          { label: '₹10–100 Crore', value: '10_100cr' },
          { label: '₹100–500 Crore', value: '100_500cr' },
          { label: 'Above ₹500 Crore', value: 'gt_500cr' },
        ],
      }),
      field({
        id: 'v13', name: 'certifications', label: 'Certifications Held', type: 'checkbox',
        required: false, order: 12, width: 'full',
        options: [
          { label: 'ISO 9001:2015', value: 'iso9001' },
          { label: 'ISO 27001 (InfoSec)', value: 'iso27001' },
          { label: 'CMMI Level 3+', value: 'cmmi' },
          { label: 'DGQA Approved', value: 'dgqa' },
          { label: 'NSIC Registered', value: 'nsic' },
          { label: 'Make in India Certified', value: 'mii' },
          { label: 'MSME Udyam Registered', value: 'msme_udyam' },
        ],
      }),
      field({ id: 'v14', name: 'past_projects', label: 'Notable Past Projects / Clients', type: 'textarea', required: false, order: 13, width: 'full', placeholder: 'List key defence / government projects you have executed...', validation: { maxLength: 1000 } }),
    ],
    settings: {
      submitLabel: 'Register as Vendor',
      successMessage: 'Your vendor registration has been received. Our procurement team will verify your details and contact you within 5 working days.',
      allowMultipleSubmissions: false,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM 3: Post-Event Feedback Form (simple, short)
// ─────────────────────────────────────────────────────────────────────────────
export const FEEDBACK_FORM = {
  id: 'mock-form-003',
  name: 'Defence Expo 2025 — Feedback Form',
  type: 'Feedback',
  description: 'We value your feedback from our stall at Aero India 2025. Takes less than 2 minutes.',
  is_active: true,
  schema: {
    fields: [
      field({ id: 'fb1', name: 'name', label: 'Your Name', type: 'text', required: false, order: 0, width: 'half', placeholder: 'Optional' }),
      field({ id: 'fb2', name: 'organization', label: 'Organization', type: 'text', required: false, order: 1, width: 'half', placeholder: 'Optional' }),
      field({
        id: 'fb3', name: 'overall_rating', label: 'Overall Experience Rating', type: 'radio',
        required: true, order: 2, width: 'full',
        options: [
          { label: '⭐ Poor', value: '1' },
          { label: '⭐⭐ Below Average', value: '2' },
          { label: '⭐⭐⭐ Average', value: '3' },
          { label: '⭐⭐⭐⭐ Good', value: '4' },
          { label: '⭐⭐⭐⭐⭐ Excellent', value: '5' },
        ],
      }),
      field({
        id: 'fb4', name: 'aspects_liked', label: 'What did you like most?', type: 'checkbox',
        required: false, order: 3, width: 'full',
        options: [
          { label: 'Product demonstrations', value: 'demo' },
          { label: 'Technical presentations', value: 'tech' },
          { label: 'Team knowledge & responsiveness', value: 'team' },
          { label: 'Brochures & materials quality', value: 'brochure' },
          { label: 'Stall design & ambience', value: 'stall' },
        ],
      }),
      field({
        id: 'fb5', name: 'interested_products', label: 'Products You Are Interested In', type: 'checkbox',
        required: false, order: 4, width: 'full',
        options: [
          { label: 'IDAS Radar Suite', value: 'idas' },
          { label: 'SecureComm Terminal', value: 'securecomm' },
          { label: 'NightHawk NVD Series', value: 'nighthawk' },
          { label: 'BorderShield Sensor Network', value: 'bordershield' },
          { label: 'CUAS Drone Jammer', value: 'cuas' },
        ],
      }),
      field({
        id: 'fb6', name: 'followup_requested', label: 'Would you like a follow-up from our team?', type: 'radio',
        required: true, order: 5, width: 'half',
        options: [
          { label: 'Yes, please call me', value: 'call' },
          { label: 'Yes, send me info by email', value: 'email' },
          { label: 'No, thanks', value: 'no' },
        ],
      }),
      field({ id: 'fb7', name: 'followup_contact', label: 'Best Contact for Follow-up', type: 'text', required: false, order: 6, width: 'half', placeholder: 'Phone or email' }),
      field({ id: 'fb8', name: 'suggestions', label: 'Any suggestions for improvement?', type: 'textarea', required: false, order: 7, width: 'full', placeholder: 'Your honest feedback helps us serve you better...', validation: { maxLength: 500 } }),
    ],
    settings: {
      submitLabel: 'Submit Feedback',
      successMessage: 'Thank you for your valuable feedback! We look forward to connecting with you again.',
      allowMultipleSubmissions: true,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// FORM 4: Complaint / Grievance Form
// ─────────────────────────────────────────────────────────────────────────────
export const COMPLAINT_FORM = {
  id: 'mock-form-004',
  name: 'Grievance & Complaint Registration',
  type: 'Complaint',
  description: 'Submit your complaint and receive a tracking reference within 2 hours.',
  is_active: true,
  schema: {
    fields: [
      field({ id: 'c1', name: 'complainant_name', label: 'Your Full Name', type: 'text', required: true, order: 0, width: 'half', validation: { minLength: 2 } }),
      field({ id: 'c2', name: 'complainant_email', label: 'Email Address', type: 'email', required: true, order: 1, width: 'half' }),
      field({ id: 'c3', name: 'complainant_phone', label: 'Phone Number', type: 'phone', required: true, order: 2, width: 'half' }),
      field({ id: 'c4', name: 'order_reference', label: 'Order / Contract Reference No.', type: 'text', required: false, order: 3, width: 'half', placeholder: 'e.g. PO-2025-04-0231' }),
      field({
        id: 'c5', name: 'complaint_type', label: 'Nature of Complaint', type: 'select',
        required: true, order: 4, width: 'half',
        options: [
          { label: 'Product Quality Issue', value: 'quality' },
          { label: 'Delivery Delay', value: 'delivery' },
          { label: 'Invoice / Billing Discrepancy', value: 'billing' },
          { label: 'Technical Support Not Provided', value: 'tech_support' },
          { label: 'Warranty Claim', value: 'warranty' },
          { label: 'Staff / Service Conduct', value: 'conduct' },
          { label: 'Other', value: 'other' },
        ],
      }),
      field({
        id: 'c6', name: 'severity', label: 'Severity Level', type: 'radio',
        required: true, order: 5, width: 'half',
        options: [
          { label: 'Low — Minor inconvenience', value: 'low' },
          { label: 'Medium — Affecting operations', value: 'medium' },
          { label: 'High — Critical / Mission impacting', value: 'high' },
        ],
      }),
      field({ id: 'c7', name: 'incident_date', label: 'Date of Incident', type: 'date', required: true, order: 6, width: 'half' }),
      field({ id: 'c8', name: 'complaint_description', label: 'Detailed Description of Complaint', type: 'textarea', required: true, order: 7, width: 'full', placeholder: 'Describe the issue clearly — what happened, when, and what impact it caused.', validation: { minLength: 30, maxLength: 2000 } }),
      field({ id: 'c9', name: 'resolution_expected', label: 'Expected Resolution', type: 'textarea', required: false, order: 8, width: 'full', placeholder: 'What outcome are you seeking?', validation: { maxLength: 500 } }),
      field({ id: 'c10', name: 'evidence_document', label: 'Attach Supporting Document', type: 'file', required: false, order: 9, width: 'full', helpText: 'Photos, invoices, delivery receipts — PDF/JPG up to 5MB' }),
    ],
    settings: {
      submitLabel: 'Register Complaint',
      successMessage: 'Your complaint has been registered. You will receive a tracking reference on your email within 2 hours. Our team will respond within 3 working days.',
      allowMultipleSubmissions: true,
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Export all as a map for easy switching in dev
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_FORMS = {
  enquiry:            ENQUIRY_FORM,
  vendor_registration: VENDOR_REGISTRATION_FORM,
  feedback:           FEEDBACK_FORM,
  complaint:          COMPLAINT_FORM,
};

export default MOCK_FORMS;
