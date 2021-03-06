import { RegionalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Sterfte', () => {
  before(() => {
    cy.beforeRegionTests('sterfte');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const rivmLastValue = this.regionData.deceased_rivm.last_value;

    const kpiTestInfo = {
      covid_daily: formatNumber(rivmLastValue.covid_daily),
      covid_total: formatNumber(rivmLastValue.covid_total),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
