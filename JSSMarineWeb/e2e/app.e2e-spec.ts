import { JSSMarineWebPage } from './app.po';

describe('jssmarine-web App', () => {
  let page: JSSMarineWebPage;

  beforeEach(() => {
    page = new JSSMarineWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
