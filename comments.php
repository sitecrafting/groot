<?php
/**
 * The template for displaying comments.
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if (post_password_required()) {
    return;
}
?>

<div id="comments" class="comments-area">

	<?php if (have_comments()) : ?>
		<h3 class="title">
		<?php
          printf(
              esc_html(_nx('Comments (1)', 'Comments (%1$s)', get_comments_number(), 'comments title')),
              number_format_i18n(get_comments_number())
          );
          ?>
        </h3>
		<ol class="comment-list">
			<?php
            wp_list_comments(array(
              'style' => 'ol',
              'short_ping' => true,
              'type' => 'comment',
              'callback' => function ($comment, $args, $depth) {
                  $GLOBALS['comment'] = $comment;
                  extract($args, EXTR_SKIP); ?>
                	<li id="comment-<?php comment_ID() ?>" <?php comment_class(empty($args['has_children']) ? '' : 'parent') ?>>

                        <?php edit_comment_link(__('(Edit Comment)'), '  ', ''); ?>
                		<div class="comment-text">
                			<?php comment_text(); ?>
                			<?php if ($comment->comment_approved == '0') : ?>
                				<div class="comment-awaiting-moderation"><?php _e('(Your comment is awaiting moderation.)'); ?></div>
                			<?php endif; ?>
                		</div>
                		<div class="comment-author">
                			<span class="comment-byline"><?= comment_author(); ?> - </span>
                			<span class="comment-meta"><?= get_comment_date(); ?></span>
                		</div>

                	</li>
                  <?php
              }, //end callback
            ));
            ?>
		</ol><!-- .comment-list -->

		<?php if (get_comment_pages_count() > 1 && get_option('page_comments')) : // Are there comments to navigate through??>
		<nav id="comment-nav-below" class="navigation comment-navigation" role="navigation">
			<h2 class="screen-reader-text"><?php esc_html_e('Comment navigation'); ?></h2>
			<div class="nav-links">
				<div class="nav-previous"><?php previous_comments_link(esc_html__('Older Comments')); ?></div>
				<div class="nav-next"><?php next_comments_link(esc_html__('Newer Comments')); ?></div>
			</div><!-- .nav-links -->
		</nav><!-- #comment-nav-below -->
		<?php endif; // Check for comment navigation.?>

	<?php endif; // Check for have_comments().?>

	<?php
    // If comments are closed and there are comments, leave a note
    if (!comments_open() && get_comments_number() && post_type_supports(get_post_type(), 'comments')) :
    ?>
		<p class="no-comments"><?php esc_html_e('Comments are closed.'); ?></p>
	<?php endif; ?>

	<?php

  $arrFormFields = array(
  'author' => '<div class="flex-row"><div class="col-lg-6"><label for="author">'.__('Name').($req ? ' <span class="required">*</span>' : '').'</label> '.
                  '<input id="author" name="author" type="text" value="'.esc_attr($commenter['comment_author']).'" size="30"'.$aria_req.' />'.
                  '</div>',
  'email' => '<div class="col-lg-6"><label for="email">'.__('Email').($req ? ' <span class="required">*</span>' : '').'</label> '.
                  '<input id="email" name="email" type="text" value="'.esc_attr($commenter['comment_author_email']).'" size="30"'.$aria_req.' />'.
              '</div></div>',
  );

  comment_form(
      array(
          'fields' => $arrFormFields,
          'title_reply_before' => '<h3 class="title">',
          'title_reply' => 'Leave a Comment',
          'title_reply_after' => '</h3>',
          'comment_field' => '<div class="comment-field"><label for="comment">'._x('Comment', 'noun').($req ? ' <span class="required">*</span>' : '').'</label><textarea id="comment" name="comment" aria-required="true" ></textarea></div>',
          'label_submit' => 'Submit',
          'class_submit' => 'btn',
          )
  );
  ?>

</div><!-- #comments -->
