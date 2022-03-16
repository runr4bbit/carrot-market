import mail from "@sendgrid/mail";
import twilio from "twilio";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

mail.setApiKey(process.env.SENDGRID_API_KEY!);
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    // const response = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.TWILIO_MY_PHONE!,
    //   body: `Your login token is ${payload}.`,
    // });
    // console.log(response);
  } else if (email) {
    // const response = await mail.send({
    //   from: "runr4bbit@gmail.com",
    //   to: "runr4bbit@gmail.com",
    //   subject: "Your Carrot Market Verification Email",
    //   text: `Your login token is ${payload}.`,
    //   html: `<strong>Your login token is ${payload}.</strong>`,
    // });
    // console.log(response);
  }
  return res.json({
    ok: true,
  });
}

export default withHandler({ method: "POST", handler, isPrivate: false });
