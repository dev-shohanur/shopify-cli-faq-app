import { Link, useLoaderData, useParams, useSubmit } from "@remix-run/react";
import { ArrowLeftMinor } from "@shopify/polaris-icons";
import {
  Badge,
  Button,
  ButtonGroup,
  FormLayout,
  Grid,
  Icon,
  IndexTable,
  LegacyCard,
  Page,
  Text,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import db from "../db.server";
import { useState } from "react";

export const loader = async ({ request, params }) => {
  const group = await db.faqGroup.findUnique({
    where: { id: params.group_id },
  });
  const faqs = await db.Faq.findMany({
    where: { group_id: params.group_id },
  });
  return { faqs, group };
};

export default function Faq() {
  const [updateFaqData, setUpdateFaqData] = useState({});
  const { group_id } = useParams("group_id");
  const submit = useSubmit();
  const { faqs, group } = useLoaderData(group_id);

  const orders = faqs;
  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const rowMarkup = orders.map(
    ({ id, shop, name, description, createdAt, updatedAt }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>{index + 1}</IndexTable.Cell>
        <IndexTable.Cell>{group.name}</IndexTable.Cell>
        <IndexTable.Cell>{name}</IndexTable.Cell>
        <IndexTable.Cell>{description}</IndexTable.Cell>
        <IndexTable.Cell>
          {new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(new Date(updatedAt))}
        </IndexTable.Cell>
        <IndexTable.Cell>
          <ButtonGroup>
            <Button
              variant="primary"
              tone="success"
              onClick={() =>
                setUpdateFaqData({
                  id,
                  shop,
                  name,
                  description,
                  group_id: group.id,
                  createdAt,
                  updatedAt,
                })
              }
            >
              Edit
            </Button>
            <Button
              variant="primary"
              tone="critical"
              onClick={() => submit({ id }, { method: "delete" })}
            >
              Delete
            </Button>
          </ButtonGroup>
        </IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  function handleCreateFaq(event) {
    event.preventDefault();
    const data = {
      group_id: group_id,
      name: event.target.name.value,
      description: event.target.description.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    submit(data, { method: "post" });
    event.target.reset();
  }
  function handleUpdate(event) {
    event.preventDefault();
    const data = {
      id: updateFaqData.id,
      group_id: updateFaqData.group_id,
      name: event.target.name.value,
      shop: updateFaqData.shop,
      description: event.target.description.value,
      createdAt: new Date(updateFaqData?.createdAt),
    };
    submit(data, { method: "put" });
    setUpdateFaqData({});
  }

  console.log(updateFaqData);

  return (
    <Page fullWidth>
      {/* <ui-title-bar title="FAQ" /> */}
      <Link to="/app/faqGroups">
        <button className="bg-white py-3 px-6 rounded flex justify-center items-center text-black my-10">
          <Icon source={ArrowLeftMinor} />
          Back
        </button>
      </Link>
      <div
        className={`fixed bottom-0 w-[100%] h-[100%] justify-center backdrop-blur  items-center z-40 ${
          updateFaqData.id ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white z-[102] p-6 rounded-lg shadow border relative">
          <form onSubmit={handleUpdate}>
            <label>
              <span className="text-xl font-medium capitalize">
                Group Title
              </span>
              <input
                name="name"
                type="text"
                defaultValue={updateFaqData?.name}
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
                defaultValue={updateFaqData?.description}
              />
            </label>
            <div className="flex justify-between gap-6">
              <div
                onClick={() => setUpdateFaqData({})}
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
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <FormLayout>
            <form onSubmit={handleCreateFaq}>
              <label>
                <span className="text-xl font-medium capitalize">
                  Faq Title
                </span>
                <input
                  name="name"
                  type="text"
                  className="w-full text-lg mb-6 mt-3 pl-12 pr-3 py-2 text-gray-500 bg-white outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
                />
              </label>
              <label>
                <span className="text-xl font-medium capitalize">
                  Faq Description
                </span>

                <textarea
                  className="w-full mb-6  text-lg mt-3 resize-y pl-12 pr-3 py-2 text-gray-500 bg-white outline-none border-2 focus:border-indigo-600 shadow-sm rounded-lg"
                  name="description"
                />
              </label>
              <button
                type="submit"
                className="btn bg-blue-700 text-lg font-medium text-white rounded w-full py-3"
              >
                Create
              </button>
            </form>
          </FormLayout>
        </Grid.Cell>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <LegacyCard>
            <IndexTable
              resourceName={resourceName}
              itemCount={orders.length}
              headings={[
                { title: "#" },
                { title: "Group" },
                { title: "Name" },
                { title: "Description" },
                { title: "UpdatedAt" },
                { title: "Action" },
              ]}
            >
              {rowMarkup}
            </IndexTable>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const data = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };
  if (request.method === "DELETE") {
    await db.Faq.delete({
      where: {
        id: data.id,
      },
    });
    return {
      message: "Faq Deleted successfully",
    };
  }
  if (request.method === "PUT") {
    await db.Faq.update({
      where: {
        id: data.id,
      },
      data: {
        group_id: data.group_id,
        name: data.name,
        description: data.description,
        shop: data.shop,
        createdAt: new Date(data.createdAt).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return {
      message: "Faq Updated successfully",
    };
  }
  if (request.method === "POST") {
    await db.Faq.create({ data });

    return {
      message: "Faq created successfully",
    };
  }

  return {
    message: "Error updating",
  };
}
