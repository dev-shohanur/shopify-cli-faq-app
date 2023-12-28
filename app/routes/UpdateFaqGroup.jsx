import React from "react";
import db from "../db.server";

export default function UpdateFaqGroup({
  updateGroupData,
  setUpdateGroupData,
}) {
  console.log(updateGroupData.id);

  return (
    <div
      className={`fixed top-0 w-[100%] h-[100%] justify-center backdrop-blur  items-center z-40 ${
        updateGroupData.id ? "flex" : "hidden"
      }`}
    >
      <div className="bg-white z-[102] p-6 rounded-lg shadow border relative">
        <form method="put">
          <label>
            <span className="text-xl font-medium capitalize">Group Title</span>
            <input
              name="name"
              type="text"
              defaultValue={updateGroupData?.name}
              className="w-full text-lg mb-6 mt-3 pl-12 pr-3 py-2 text-gray-500 bg-white outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
            />
          </label>
          <label>
            <span className="text-xl font-medium capitalize">
              Group Description
            </span>

            <textarea
              className="w-full mb-6  text-lg mt-3 resize-y pl-12 pr-3 py-2 text-gray-500 bg-white outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
              name="description"
              defaultValue={updateGroupData?.description}
            />
          </label>
          <div className="flex justify-between gap-6">
            <div
              onClick={() => setUpdateGroupData({})}
              className="btn bg-white cursor-pointer flex justify-center items-center text-lg font-medium text-black shadow rounded w-1/2 py-3 border"
            >
              Cancel
            </div>
            <button
              type="submit"
              className="btn bg-blue-700 text-lg font-medium text-white rounded w-1/2 py-3"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function action(data) {
  if (data.request.method === "PUT") {
    const formData = await data.request.formData();

    const groups = Object.fromEntries(formData);

    const a = await db.faqGroup.findMany();

    console.log(a, "dhdhdhdh");

    console.log(shop);

    const group = await db.faqGroup.update({
      where: {
        id: updateGroupData?.id,
      },
      data: {
        shop: updateGroupData?.shop,
        ...groups,
        createdAt: updateDate?.createdAt,
        updatedAt: new Date().toISOString(),
      },
    });
    return group;
  }
  return {
    message: "Error updating",
  };
}
