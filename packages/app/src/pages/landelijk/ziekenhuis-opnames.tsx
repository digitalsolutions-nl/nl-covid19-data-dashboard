import { useRouter } from 'next/router';
import { useState } from 'react';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ChoroplethTile } from '~/components-styled/choropleth-tile';
import { ContentHeader } from '~/components-styled/content-header';
import { KpiTile } from '~/components-styled/kpi-tile';
import { KpiValue } from '~/components-styled/kpi-value';
import { LineChartTile } from '~/components-styled/line-chart-tile';
import { PageBarScale } from '~/components-styled/page-barscale';
import { TileList } from '~/components-styled/tile-list';
import { TwoKpiSection } from '~/components-styled/two-kpi-section';
import { municipalThresholds } from '~/components/choropleth/municipal-thresholds';
import { MunicipalityChoropleth } from '~/components/choropleth/municipality-choropleth';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { SafetyRegionChoropleth } from '~/components/choropleth/safety-region-choropleth';
import { createSelectMunicipalHandler } from '~/components/choropleth/select-handlers/create-select-municipal-handler';
import { createSelectRegionHandler } from '~/components/choropleth/select-handlers/create-select-region-handler';
import { createMunicipalHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/municipal/create-municipal-hospital-admissions-tooltip';
import { createRegionHospitalAdmissionsTooltip } from '~/components/choropleth/tooltips/region/create-region-hospital-admissions-tooltip';
import { FCWithLayout } from '~/domain/layout/layout';
import { getNationalLayout } from '~/domain/layout/national-layout';
import { SEOHead } from '~/components/seoHead';
import siteText from '~/locale/index';
import {
  getNationalStaticProps,
  NationalPageProps,
} from '~/static-props/nl-data';

const text = siteText.ziekenhuisopnames_per_dag;

const IntakeHospital: FCWithLayout<NationalPageProps> = (props) => {
  const { data } = props;
  const router = useRouter();
  const [selectedMap, setSelectedMap] = useState<'municipal' | 'region'>(
    'region'
  );
  const dataHospitalNice = data.hospital_nice;
  const dataHospitalLcps = data.hospital_lcps;
  const lastValueNice = data.hospital_nice.last_value;
  const lastValueLcps = data.hospital_lcps.last_value;

  return (
    <>
      <SEOHead
        title={text.metadata.title}
        description={text.metadata.description}
      />
      <TileList>
        <ContentHeader
          category={siteText.nationaal_layout.headings.ziekenhuizen}
          screenReaderCategory={
            siteText.ziekenhuisopnames_per_dag.titel_sidebar
          }
          title={text.titel}
          icon={<Ziekenhuis />}
          subtitle={text.pagina_toelichting}
          metadata={{
            datumsText: text.datums,
            dateOrRange: lastValueNice.date_unix,
            dateOfInsertionUnix: lastValueNice.date_of_insertion_unix,
            dataSources: [text.bronnen.nice, text.bronnen.lnaz],
          }}
          reference={text.reference}
        />

        <TwoKpiSection>
          <KpiTile
            title={text.barscale_titel}
            description={text.extra_uitleg}
            metadata={{
              date: lastValueNice.date_unix,
              source: text.bronnen.nice,
            }}
          >
            <PageBarScale
              data={data}
              scope="nl"
              metricName="hospital_nice"
              metricProperty="admissions_moving_average"
              localeTextKey="ziekenhuisopnames_per_dag"
              differenceKey="hospital_nice__admissions_moving_average"
            />
          </KpiTile>

          <KpiTile
            title={text.kpi_bedbezetting.title}
            description={text.kpi_bedbezetting.description}
            metadata={{
              date: lastValueLcps.date_unix,
              source: text.bronnen.lnaz,
            }}
          >
            <KpiValue
              data-cy="beds_occupied_covid"
              absolute={lastValueLcps.beds_occupied_covid}
              difference={data.difference.hospital_lcps__beds_occupied_covid}
            />
          </KpiTile>
        </TwoKpiSection>

        <ChoroplethTile
          title={text.map_titel}
          description={text.map_toelichting}
          onChartRegionChange={setSelectedMap}
          chartRegion={selectedMap}
          legend={{
            thresholds:
              selectedMap === 'municipal'
                ? municipalThresholds.hospital_nice.admissions_moving_average
                : regionThresholds.hospital_nice.admissions_moving_average,
            title: text.chloropleth_legenda.titel,
          }}
          metadata={{
            date: lastValueNice.date_unix,
            source: text.bronnen.nice,
          }}
        >
          {selectedMap === 'municipal' && (
            <MunicipalityChoropleth
              metricName="hospital_nice"
              metricProperty="admissions_moving_average"
              tooltipContent={createMunicipalHospitalAdmissionsTooltip(
                createSelectMunicipalHandler(router, 'ziekenhuis-opnames')
              )}
              onSelect={createSelectMunicipalHandler(
                router,
                'ziekenhuis-opnames'
              )}
            />
          )}
          {selectedMap === 'region' && (
            <SafetyRegionChoropleth
              metricName="hospital_nice"
              metricProperty="admissions_moving_average"
              tooltipContent={createRegionHospitalAdmissionsTooltip(
                createSelectRegionHandler(router, 'ziekenhuis-opnames')
              )}
              onSelect={createSelectRegionHandler(router, 'ziekenhuis-opnames')}
            />
          )}
        </ChoroplethTile>

        <LineChartTile
          title={text.linechart_titel}
          description={text.linechart_description}
          values={dataHospitalNice.values}
          signaalwaarde={40}
          linesConfig={[
            {
              metricProperty: 'admissions_moving_average',
            },
          ]}
          metadata={{
            source: text.bronnen.nice,
          }}
        />

        <LineChartTile
          title={text.chart_bedbezetting.title}
          description={text.chart_bedbezetting.description}
          values={dataHospitalLcps.values}
          linesConfig={[
            {
              metricProperty: 'beds_occupied_covid',
            },
          ]}
          metadata={{
            source: text.bronnen.lnaz,
          }}
        />
      </TileList>
    </>
  );
};

IntakeHospital.getLayout = getNationalLayout;

export const getStaticProps = getNationalStaticProps;

export default IntakeHospital;
