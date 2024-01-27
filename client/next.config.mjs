/** @type {import('next').NextConfig} */
const nextConfig = {

    images : {
        remotePatterns : [
            {
                protocol : "https", 
                hostname : "logowik.com",
                port: "",
                 
            }
        ]
    }
};

export default nextConfig;
