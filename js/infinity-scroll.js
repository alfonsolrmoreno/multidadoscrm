(function($) {

    $.fn.scrollPagination = function(options) {

        var settings = {
            nop: 10, // The number of posts per scroll to be loaded
            offset: 0, // Initial offset, begins at 0 in this case
            error: 'No More Posts!', // When the user reaches the end this is the message that is
            // displayed. You can change this if you want.
            delay: 250, // When you scroll down the posts will load after a delayed amount of time.
            // This is mainly for usability concerns. You can alter this as you see fit
            scroll: true // The main bit, if set to false posts will not load as the user scrolls.
                    // but will still load if the user clicks.
        }

        // Extend the options so they work with the plugin
        if (options) {
            $.extend(settings, options);
        }

        // For each so that we keep chainability.
        return this.each(function() {

            // Some variables
            $this = $(this);
            $settings = settings;
            var offset = $settings.offset + $settings.nop;
            var busy = false; // Checks if the scroll action is happening
            // so we don't run it multiple times

            // Custom messages based on settings
            if ($settings.scroll == true)
                $initmessage = '';
            else
                $initmessage = 'Clique aqui para mostrar mais';

            // Append custom messages and extra UI
            $this.append('<ul data-role="listview" data-filter="true" data-filter-placeholder="Selecione" data-divider-theme="b" class="lista-infinity"></ul><div class="loading-bar">' + $initmessage + '</div>');

            function getData() {
                $.mobile.loading('show', {
                    text: 'Carregando...',
                    textVisible: true,
                    theme: 'b'
                });
                // Post data to ajax.php
                $.ajax({
                    type: 'GET',
                    url: $settings.url,
                    dataType: "jsonp",
                    crossDomain: true,
                    data: {
                        action: 'scrollpagination',
                        number: $settings.nop,
                        offset: offset,
                        tipo: $settings.tipo,
                        q: $settings.q,
                        idcliente: $settings.idcliente,
                        idempresa: $settings.idempresa,
                        idsenha: $settings.idsenha
                    }
                })
                        .then(function(data) {

                            // Change loading bar content (it may have been altered)
                            $this.find('.loading-bar').html($initmessage);

                            // If there is no data returned, there are no more posts to be shown. Show error
                            if (data == "") {
                                $this.find('.loading-bar').html($settings.error);
                            }
                            else {

                                // Offset increases
                                offset = offset + $settings.nop;

                                // Append the data to the content div
                                $this.find('.lista-infinity').append(data);

                                // No longer busy!
                                busy = false;
                            }
                            $.mobile.loading('hide');
                        });

            }

            getData(); // Run function initially

            // If scrolling is enabled
            if ($settings.scroll == true) {
                // .. and the user is scrolling
                $(window).scroll(function() {

                    // Check the user is at the bottom of the element
                    if ($(window).scrollTop() + $(window).height() > $this.height() && !busy) {

                        // Now we are working, so busy is true
                        busy = true;

                        // Tell the user we're loading posts
                        $this.find('.loading-bar').html('Carregando...');

                        // Run the function to fetch the data inside a delay
                        // This is useful if you have content in a footer you
                        // want the user to see.
                        setTimeout(function() {

                            getData();

                        }, $settings.delay);

                    }
                });
            }

            // Also content can be loaded by clicking the loading bar/
            $this.find('.loading-bar').click(function() {

                if (busy == false) {
                    busy = true;
                    getData();
                }

            });

        });
    }

})(jQuery);
