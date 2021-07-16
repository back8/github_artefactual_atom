

(function ($) {

  "use strict";

  //var TreeviewPager = function(limit, treeEl, url)
  //{
  //  Pager.call(this, limit);
  //  this.treeEl = treeEl;
  //  this.url = url;
  //  this.rootId = '#';
  //}


  function TreeviewPager ()
  {
  };

  //TreeviewPager.prototype = new Pager;
  //TreeviewPager.prototype = $('#fullwidth-treeview-configuration').data('pager');

  TreeviewPager.prototype.initTreeviewPager = function(limit, treeEl, url)
  {
    console.log("SBSBSB inside treeview pager.")
    //Pager.call(this, limit);
    this.treeEl = treeEl;
    this.url = url;
    this.rootId = '#';
  }

  TreeviewPager.prototype.getAndAppendNodes = function(cb)
  {
    // Assemble query and creation queue
    var queryString = "?skip=" + this.getSkip() + "&nodeLimit=" + this.getLimit();
    var pagedUrl = this.url + queryString;
    var createQueue = [];
    var self = this;

    // Get and append additional nodes
    $.ajax({
      url: pagedUrl,
      success: function(results) {

        // Add nodes to creation queue
        results.nodes.forEach(function(node) {
          createQueue.push(node);
        });

        var next = function()
        {
          if (createQueue.length)
          {
            // Queue isn't empty: create node
            var node = createQueue.shift();
            self.treeEl.jstree(true).create_node(self.rootId, node, "last", next);
          }
          else
          {
            // Queue is empty so excute cleanup logic
            cb();
          };
        };

        next();
      }
    });
  }

  // Update count of remaining nodes, etc.
  TreeviewPager.prototype.updateMoreLink = function($moreButton, $resetButton)
  {
    var scrollOffset = 0;

    if (this.getRemaining() > 0)
    {
      // Update count shown in paging button
      $moreButton.val($moreButton.data('label').replace('%1%', this.getRemaining()));
      $moreButton.show();
    }
    else
    {
      $moreButton.hide();
    }

    if ($resetButton !== undefined)
    {
      if (this.getSkip())
      {
        $resetButton.show();
      }
      else
      {
        $resetButton.hide();
      }
    }

    // Scroll to last item in tree
    if (this.getSkip() && $('li.jstree-node:last').length)
    {
       scrollOffset = jQuery('li.jstree-node:last')[0].offsetTop;
    }

    $('.jstree-container-ul').parent().scrollTop(scrollOffset);
  }

  TreeviewPager.prototype.reset = function($moreButton, $resetButton)
  {
    this.setSkip(0);

    // Only reset tree if it already exists
    if (this.treeEl.jstree(true) !== false)
    {
      // Clear tree state if state plugin is being used
      if (this.treeEl.jstree(true).clear_state !== undefined)
      {
        this.treeEl.jstree(true).clear_state();
      }
      this.treeEl.jstree(true).refresh(true, true);
    }

    // Update paging button and scroll treeview window to first node
    this.updateMoreLink($moreButton, $resetButton);
  }

  $(function()
  {
    var $fullWidthTreeView = $('#fullwidth-treeview-configuration');

    if ($fullWidthTreeView.length)
    {
      $fullWidthTreeView.data('treeview-pager', TreeviewPager);
    }
  });

})(jQuery);
