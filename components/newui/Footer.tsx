import React from "react";
import { footerLinks, socialMedia } from "./utils/textData";
import Image from "next/image";
import { logo } from "@/public/assets";
import styles from "./utils/styles";
import AddChainButton from "../elements/AddChainButton";

const Footer = () => {
  const logoURL = `https://cdn.blocksscan.io/tokens/img/blocksscan.png`;
  return (
    <section
      className={`${styles.flexCenter} sm:py-16 py-6 flex-col  bg-[#1c1414] `}
    >
      <div
        className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full mx-16 `}
      >
        <div className="flex-[1] flex flex-col justify-start mr-10 mx-16">
          <div className="flex items-center space-x-4">
            <Image
              src={logoURL}
              alt=""
              height={72}
              width={266}
              className="w-auto h-[72.14px] object-contain  "
            />
            <p className="text-3xl font-inter font-normal text-white">OpenScan</p>
          </div>

          <p className={`${styles.paragraph} mt-4 max-w-[312px]`}>
            A new way to make the payments easy, reliable and secure.
          </p>
          <div className="mt-4">
            <AddChainButton />
          </div>
        </div>

        <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10 mx-16">
          {footerLinks.map((footerlink) => (
            <div
              key={footerlink.title}
              className={`flex flex-col ss:my-0 my-4 min-w-[150px]`}
            >
              <h4 className="font-poppins font-medium text-[18px] leading-[27px] text-white">
                {footerlink.title}
              </h4>
              <ul className="list-none mt-4 text-gray-200">
                {footerlink.links.map((link, index) => (
                  <li
                    key={link.name}
                    className={`font-poppins font-normal text-[16px] leading-[24px] text-dimWhite  cursor-pointer ${
                      index !== footerlink.links.length - 1 ? "mb-4" : "mb-0"
                    }`}
                  >
                    {link.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45] mx-16">
        <p className="font-abel font-normal text-center text-[18px] leading-[27px] text-white mx-16">
          Copyright Ⓒ 2024 OpenScan. All Rights Reserved.
        </p>

        <div className="flex flex-row md:mt-0 mt-6 mx-16">
          {socialMedia.map((social, index) => (
            <Image
              key={social.id}
              src={social.icon}
              alt={social.id}
              className={`w-[21px] h-[21px] object-contain cursor-pointer ${
                index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
              }`}
              onClick={() => window.open(social.link)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Footer;