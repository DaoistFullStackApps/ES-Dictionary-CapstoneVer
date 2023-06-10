import React from "react";

export const RenderImage = ({ dictionaryData }) =>
  dictionaryData && (
    <img
      src={dictionaryData.image_url}
      alt={`${dictionaryData.word} is a ${dictionaryData.part_of_speech}, pronounced as '${dictionaryData.pronunciation}'`}
      className="w-full rounded object-cover"
      style={{ maxHeight: "200px", minHeight: "200px" }}
    />
  );

export const RenderDefinitions = ({ dictionaryData }) =>
  dictionaryData && (
    <div className="mb-4">
      <div className="mb-2">
        <span className="bg-coffeeBrown text-black font-semibold py-1 px-2 rounded mr-2">
          {dictionaryData.pronunciation}
        </span>
        {dictionaryData.part_of_speech && (
          <span className="bg-coffeeBrown text-black italic py-1 px-2 rounded mr-2">
            {dictionaryData.part_of_speech}
          </span>
        )}
      </div>
      {dictionaryData.definition && <p>{dictionaryData.definition}</p>}
    </div>
  );
