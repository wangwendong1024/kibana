/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { getAdvancedButton } from '../../screens/integrations';
import { ROLE, login } from '../../tasks/login';
import { navigateTo } from '../../tasks/navigation';
import {
  checkResults,
  getOsqueryFieldTypes,
  inputQuery,
  selectAllAgents,
  submitQuery,
  typeInECSFieldInput,
  typeInOsqueryFieldInput,
} from '../../tasks/live_query';

describe('EcsMapping', () => {
  before(() => {
    login(ROLE.soc_manager);
    navigateTo('/app/osquery');
  });

  it('should properly show static values in form and results', () => {
    cy.contains('New live query').click();
    selectAllAgents();
    inputQuery('select * from processes;');
    getAdvancedButton().click();
    typeInECSFieldInput('tags{downArrow}{enter}');
    getOsqueryFieldTypes('Static value');
    typeInOsqueryFieldInput('test1{enter}test2{enter}');
    submitQuery();
    checkResults();
    cy.contains('[ "test1", "test2" ]');
    typeInECSFieldInput('client.domain{downArrow}{enter}', 1);

    getOsqueryFieldTypes('Static value', 1);

    typeInOsqueryFieldInput('test3{enter}', 1);
    submitQuery();
    checkResults();
    cy.contains('[ "test1", "test2" ]');
    cy.contains('test3');
    cy.get(`[title="Remove test1 from selection in this group"]`).click();
    submitQuery();
    checkResults();
    cy.contains('[ "test2" ]');
    cy.contains('test3');
  });
});
