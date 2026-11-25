import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // De voorstelvideo's staan buiten /public en worden alleen via een geldige link gestreamd.
  outputFileTracingIncludes: {
    "/api/voorstel-video/[code]": ["./private/demos/**/*"],
  },
};

export default nextConfig;
