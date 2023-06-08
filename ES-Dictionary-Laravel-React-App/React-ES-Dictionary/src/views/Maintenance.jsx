import React from "react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-coffee">
      <section className="relative isolate overflow-hidden bg-coffee px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <figure className="mt-10">
            {/* <blockquote className="text-center font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9"> */}
            <p className="text-center text-5xl font-semibold">
              Oops, website is currently on Maintenance, we'll be back soon!
            </p>
            {/* </blockquote> */}
            <figcaption className="mt-10">
              <WrenchScrewdriverIcon className="w-12 mx-auto" />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <div className="font-semibold text-gray-900">WD47p Group2</div>
                <svg
                  viewBox="0 0 2 2"
                  width={3}
                  height={3}
                  aria-hidden="true"
                  className="fill-gray-900"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>
                <div className="text-gray-600">
                  Developers of es-dictionary.com
                </div>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
