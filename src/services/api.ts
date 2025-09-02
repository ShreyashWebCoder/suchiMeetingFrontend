// src/services/api.ts

// const BASE_URL = "https://rss-project-weef.onrender.com/api";
// const BASE_URL ='https://rss-project-30c4.onrender.com/api';

// const BASE_URL = 'http://localhost:3000/api'; // Use for your local development URL
const BASE_URL = "https://suchimeetingbackend.onrender.com/api";  // Use for your production development URL

export const API_URLS = {
  LOGIN: `${BASE_URL}/auth/login`,
  PRANTS: `${BASE_URL}/admin/prants`,
  SANGHATAN: `${BASE_URL}/admin/sanghatan`,
  ALL_USERS: `${BASE_URL}/admin/all-users`,
  ADMIN_DASHBOARD: `${BASE_URL}/admin/dashboard-data`,
  ALL_DROPDOWNS: `${BASE_URL}/admin/all-dropdowns`,
  UPLOAD_USERS: `${BASE_URL}/admin/upload`,
  ADD_NEW_PRATINIDHI_USER: `${BASE_URL}/admin/add-pratinidhi-user`,
  MASTER_DATA: `${BASE_URL}/admin/add_dropdown`,

  UPDATE_MASTER_DATA: `${BASE_URL}/admin/update-status`,

  UPDATE_STATUS: `${BASE_URL}/admin/update-status`,
  GET_PERTICULAR_PRANT_DATA: `${BASE_URL}/admin/prant`,
  SEND_EMAIL: `${BASE_URL}/admin/send-form`,
  ADMIN_SETTING: `${BASE_URL}/admin/setting`,
  SUBMIT_DATA: `${BASE_URL}/admin/submitted`,
  // Add more endpoints as needed

  // prant prachark meeting
  ADMIN_DASHBOARD_PRANT_PRACHARAK: `${BASE_URL}/admin/dashboard-data-prant-pracharak-baithak`,
  ALL_USERS_PRANT_PRACHARAK: `${BASE_URL}/admin/all-users-prant-pracharak`,
  ADD_NEW_PRANT_USER: `${BASE_URL}/admin/add-prant-pracharak-user`,

  // karyakari mandal 
  ADMIN_DASHBOARD_KARYAKARI_MANDAL: `${BASE_URL}/admin/dashboard-data-karyakari-mandal`,
  ALL_USERS_KARYAKARI_MANDAL: `${BASE_URL}/admin/all-abkm-users`,
  ADD_NEW_KARKAKARI_MANDAL: `${BASE_URL}/admin/add-abkm-user`
};

export default BASE_URL;