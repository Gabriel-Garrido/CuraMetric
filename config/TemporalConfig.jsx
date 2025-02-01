import { Temporal } from '@js-temporal/polyfill';

// Verifica si `Temporal` ya está definido en el entorno
if (typeof global.Temporal === "undefined") {
    global.Temporal = Temporal;
}

if (typeof Temporal === "undefined") {
    import("@js-temporal/polyfill").then((module) => {
        global.Temporal = module.Temporal;
    });
}

export default Temporal;