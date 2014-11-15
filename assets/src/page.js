// WebSync: Page layout handler
define('/assets/page.js', ['websync'], function(websync) {
  var self = this;
  $('.content').hide().append($('<div class="content_container"><div class="page"></div></div>')).addClass('content-page').fadeIn();
  if (!WebSyncData.body) {
    WebSyncData.body = [];
  }
  if (WebSyncAuth.view_op == 'edit' && WebSyncAuth.access != 'viewer') {
    $('.page').attr('contenteditable', true);
  }
  WebSync.toJSON = function() {
    WebSyncData.body = WS.DOMToJSON($('.content .page').get(0).childNodes);
  };
  WebSync.fromJSON = function(patch) {
    if (patch) {
      WebSync.applyPatch(patch, '/body/', $('.content .page').get(0));
    } else {
      $('.content .page').get(0).innerHTML = WS.JSONToDOM(WebSyncData.body);
    }
  };
  WebSync.setupDownloads('document', function() {
    return '<html><head><style>' + WebSyncData.custom_css.join('\n') + '</style></head><body>' + WS.JSONToDOM(WebSyncData.body) + '</body></html>';
  });
  $(document).on('modules_loaded', function() {
    WebSync.fromJSON();
    if (WebSyncData.html) {
      $('.content .page').first().append(WebSyncData.html);
      delete WebSyncData.html;
    }
    NProgress.done();
  });
  $('.content_well').children().bind('mousedown selectstart', function(e) {
    e.stopPropagation();
  });
  return self;
});
