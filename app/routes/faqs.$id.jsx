import {
  useLoaderData,
  useLocation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import db from "../db.server";

export async function loader({ request, params }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("shop");
  const faqsAll = await db.faqGroup.findMany({
    where: { shop: query },
  });
  const faqs = await db.Faq.findMany({
    where: { group_id: faqsAll[Number(params.id) - 1].id },
  });

  return {
    faqs,
    faqsAll,
  };
}

export default function Faqs() {
  const shop = useLocation();

  // console.log(shop.search.split("=")[1], "shohan");

  const { id } = useParams("id");
  const { faqs } = useLoaderData(id);

  return (
    <div className="text-center flex justify-center items-center">
      <div>
        <h2 className="text-4xl font-medium">FAQ</h2>
        <p className="text-xl">Frequently Asked Questions</p>
        <div>
          {faqs.map((faq) => (
            <div key={faq?.id} className="py-5">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>{faq.name}</span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <p className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                  {faq.description}
                </p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
