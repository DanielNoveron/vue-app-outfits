import { createApp, h } from "vue";
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';



const vuetify = createVuetify({
    components,
    directives
});
export const DialogService = {
    open(component, options = {}) {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            document.body.appendChild(container);

            let app;

            const onClose = (result) => {
                resolve(result);
                app.unmount();
                container.remove();
            };

            const onAfterLeave = () => {
                app.unmount();
                container.remove();
            };

            app = createApp({
                render() {
                    return h(component, {
                        ...options.props,
                        onClose,
                        onAfterLeave
                    });
                }
            });

            app.use(vuetify);
            app.mount(container);
        });
    }
};