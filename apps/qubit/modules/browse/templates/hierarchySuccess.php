<?php decorate_with('layout_1col.php'); ?>
<?php slot('title'); ?>

  <div class="d-flex justify-content-end flex-wrap gap-2 ms-auto">
    <input type="button" id="fullwidth-treeview-reset-button" class="btn atom-btn-secondary" value="<?php echo __('Reset'); ?>" />
    <input type="button" id="fullwidth-treeview-more-button" class="btn atom-btn-secondary" data-label="<?php echo __('%1% more'); ?>" value="" />
  </div>

  <?php echo image_tag('/vendor/jstree/themes/default/throbber.gif', ['id' => 'fullwidth-treeview-activity-indicator', 'alt' => __('Loading ...')]); ?>
  <h1><?php echo __('Hierarchy'); ?></h1>
<?php end_slot(); ?>

<?php slot('content'); ?>

<div id='main-column'></div>
<div id='fullwidth-treeview-hierarchy'>
  <span id="fullwidth-treeview-configuration" data-items-per-page="<?php echo $itemsPerPage; ?>"></span>
</div>

<?php end_slot(); ?>
