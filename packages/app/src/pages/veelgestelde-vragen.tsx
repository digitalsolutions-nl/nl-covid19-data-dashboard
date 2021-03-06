import fs from 'fs';
import { groq } from 'next-sanity';
import Head from 'next/head';
import path from 'path';
import { Collapsible } from '~/components-styled/collapsible';
import { MaxWidth } from '~/components-styled/max-width';
import { FCWithLayout, getLayoutWithMetadata } from '~/domain/layout/layout';
import { getClient, localize, PortableText } from '~/lib/sanity';
import siteText, { targetLanguage } from '~/locale/index';
import { CollapsibleList } from '~/types/cms';
import { getSkipLinkId } from '~/utils/skipLinks';
import styles from './over.module.scss';

interface StaticProps {
  props: VeelgesteldeVragenProps;
}

interface VeelgesteldeVragenProps {
  data: {
    title: string | null;
    description: unknown[] | null;
    questions: CollapsibleList[];
  };
  lastGenerated: string;
}

export async function getStaticProps(): Promise<StaticProps> {
  const filePath = path.join(process.cwd(), 'public', 'json', 'NL.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const lastGenerated = JSON.parse(fileContents).last_generated;

  const query = groq`
  *[_type == 'veelgesteldeVragen'][0]
`;
  const rawData = await getClient(false).fetch(query);
  const data = localize(rawData, [targetLanguage, 'nl']);

  return { props: { data, lastGenerated } };
}

const Verantwoording: FCWithLayout<VeelgesteldeVragenProps> = (props) => {
  const { data } = props;

  return (
    <>
      <Head>
        <link
          key="dc-type"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
        />
        <link
          key="dc-type-title"
          rel="dcterms:type"
          href="https://standaarden.overheid.nl/owms/terms/webpagina"
          title="webpagina"
        />
      </Head>

      <div className={styles.container}>
        <MaxWidth>
          <div className={styles.maxwidth}>
            {data.title && <h2>{data.title}</h2>}
            {data.description && <PortableText blocks={data.description} />}
            {data.questions && (
              <article className={styles.faqList}>
                {data.questions.map((item) => {
                  const id = getSkipLinkId(item.title);
                  return (
                    <Collapsible key={id} id={id} summary={item.title}>
                      <PortableText blocks={item.content} />
                    </Collapsible>
                  );
                })}
              </article>
            )}
          </div>
        </MaxWidth>
      </div>
    </>
  );
};

const metadata = {
  ...siteText.veelgestelde_vragen_metadata,
};

Verantwoording.getLayout = getLayoutWithMetadata(metadata);

export default Verantwoording;
