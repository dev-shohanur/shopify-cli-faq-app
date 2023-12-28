import {
  Form,
  Link,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  Box,
  Card,
  Layout,
  List,
  Page,
  Text,
  BlockStack,
  FormLayout,
  TextField,
  Button,
  LegacyCard,
  IndexTable,
  Badge,
  useIndexResourceState,
  useBreakpoints,
  Grid,
  ButtonGroup,
} from "@shopify/polaris";
import { ArrowLeftMinor } from "@shopify/polaris-icons";

import db from "../db.server";
import { authenticate } from "../shopify.server";
import UpdateFaqGroup from "./UpdateFaqGroup";
import { useState } from "react";

export const loader = async ({ request }) => {
  const groups = await db.faqGroup.findMany();
  return groups;
};
export default function AdditionalPage() {
  const [updateGroupData, setUpdateGroupData] = useState({});
  const groups = useLoaderData();
  const submit = useSubmit();

  const orders = groups;
  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(orders);

  const rowMarkup = orders.map(
    ({ id, shop, name, description, createdAt, updatedAt }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>{index + 1}</IndexTable.Cell>
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
            <Button variant="primary">
              <Link to={`/app/faq/${id}`}>FAQ's</Link>
            </Button>

            <Button
              variant="primary"
              tone="success"
              onClick={() =>
                setUpdateGroupData({
                  id,
                  shop,
                  name,
                  description,
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

  function handleUpdate(event) {
    event.preventDefault();
    const data = {
      name: event.target.name.value,
      description: event.target.description.value,
      id: updateGroupData?.id,
      shop: updateGroupData?.shop,
      createdAt: new Date(updateGroupData?.createdAt).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log(data);
    submit(data, { method: "put" });
    setUpdateGroupData({});
  }
  function handleCreateFaqGroup(event) {
    event.preventDefault();
    const data = {
      name: event.target.name.value,
      description: event.target.description.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log(data);
    submit(data, { method: "post" });
    event.target.reset();
  }

  return (
    <Page fullWidth>
      <ui-title-bar title="FAQ Group" />
      <div
        className={`fixed top-0 w-[100%] h-[100%] justify-center backdrop-blur  items-center z-40 ${
          updateGroupData.id ? "flex" : "hidden"
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
      <Grid>
        <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
          <FormLayout>
            <form onSubmit={handleCreateFaqGroup}>
              <label>
                <span className="text-xl font-medium capitalize">
                  Group Title
                </span>
                <input
                  name="name"
                  type="text"
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
          <LegacyCard className="z-30">
            <IndexTable
              condensed={useBreakpoints().smDown}
              resourceName={resourceName}
              itemCount={orders.length}
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: "index" },
                { title: "Title" },
                { title: "Description" },
                { title: "Date" },
                { title: "Action" },
              ]}
              pagination={{
                hasNext: true,
                onNext: () => {},
              }}
            >
              {rowMarkup}
            </IndexTable>
          </LegacyCard>
        </Grid.Cell>
      </Grid>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const data = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };
  // await fetch("https://webhook.site/2bf36564-c0a2-4836-a688-a99050e5be45", {
  //   method: "POST",
  //   body: JSON.stringify(data),
  // });
  if (request.method === "DELETE") {
    await db.faqGroup.delete({
      where: {
        id: data.id,
      },
    });
    return redirect("/app/faqGroups");
  }
  if (request.method === "PUT") {
    await db.faqGroup.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        description: data.description,
        shop: data.shop,
        createdAt: new Date(data.createdAt).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return redirect("/app/faqGroups");
  }
  if (request.method === "POST") {
    await db.faqGroup.create({ data });

    return redirect("/app/faqGroups");
  }

  return {
    message: "Error updating",
  };
}
