/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // السماح بجلب الصور من Cloudinary
  },
};

export default nextConfig;
