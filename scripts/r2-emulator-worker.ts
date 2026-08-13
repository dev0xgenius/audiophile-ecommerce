// Minimal worker to enable local R2 emulation
const worker = {
  async fetch(): Promise<Response> {
    return new Response("R2 Emulator Worker");
  },
};

export default worker;
