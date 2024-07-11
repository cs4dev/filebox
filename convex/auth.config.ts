// eslint-disable-next-line import/no-anonymous-default-export
export default {
    providers: [
      {
        domain: process.env.CLERK_ISSUER!,
        applicationID: "convex",
      },
    ]
  };