"use client";
import { useState, useEffect } from "react";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
// import { Heading, Link, Paragraph } from "@/components/documentation";
// import { ResumeTable } from "@/profile/ResumeTable";
import { FlexboxSpacer } from "@/components/FlexboxSpacer";
import ResumeTable from "./resumeTable";
import Link from "next/link";
import { Resume } from "@/lib/redux/types";
// import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";

type ResumeDisplayProps = {
  resume: Resume;
};

export default function ResumeParser() {
  const [fileUrl, setFileUrl] = useState();
  const [textItems, setTextItems] = useState<TextItems>([]);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  useEffect(() => {
    async function test() {
      const textItems = await readPdf("");
      setTextItems(textItems);
    }
    test();
  }, [fileUrl]);

  return (
    <div className="min-h-screen mt-32 mb-32 ">
      <div className="container mx-auto">
        <ResumeTable />

        {/* <section className="container mt-5 p-2  grow px-4 md:max-w-[600px] md:px-0">
          <div className="aspect-h-[10] aspect-w-7">
            <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full rounded-xl" />
          </div>
        </section> */}
      </div>
    </div>
    // <main className="h-full w-full overflow-hidden">
    //   <div className="">
    //     <div className="flex justify-center px-2 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end">
    //       {/* <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
    //         <div className="aspect-h-[10] aspect-w-7">
    //           <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full rounded-xl" />
    //         </div>
    //       </section> */}
    //       {/* <FlexboxSpacer maxWidth={45} className="hidden md:block" /> */}
    //     </div>
    //     <div className="flex px-6 text-gray-900 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
    //       {/* <FlexboxSpacer maxWidth={45} className="hidden md:block" /> */}
    //       <section className="max-w-[600px] grow">

    //         <ResumeTable resume={resume} />
    //         {/* <ResumeParserAlgorithmArticle textItems={textItems} lines={lines} sections={sections} /> */}
    //         <div className="pt-24" />
    //       </section>
    //     </div>
    //   </div>
    // </main>
  );
}
