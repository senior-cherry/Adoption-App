'use server';

import nodemailer from 'nodemailer';
import {getTranslations} from "next-intl/server";

export async function sendEmail(email: string, decision: string) {
    const t = getTranslations("email");

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USERNAME,
            to: email,
            subject: (await t)("header"),
            text: decision === "approve" ? (await t)("approve") : (await t)("deny"),
            replyTo: email,
        });
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Failed to send email.' };
    }
}