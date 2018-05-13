let Locale = {
    document: {
        success: {
            delete: 'El documento se eliminó correctamente'
        },
        error: {
            not_found: 'No se encontró el documento',
            invalid: 'El documento no es válido',
            unauthorized: 'Éste documento no te pertenece',
            bad_request: 'La solicitud no se pudo procesar'
        },
        share_modal: {
            title: 'Compartir con otros usuarios',
            label: 'Cualquiera con el vínculo puede verlo.',
            test_link: 'Prueba el enlace'
        },
        lastmod: 'La última modificación se realizó '
    },
    ui: {
        title: 'Markdown Editor',
        delete_confirmation: {
            title: 'Escribe nuevamente el nombre del documento para borrarlo',
            placeholder: 'Nombre del documento'
        }
    },
    actions: {
        new: 'Nuevo',
        edit: 'Editar',
        delete: 'Eliminar',
        cancel: 'Cancelar',
        add: 'Agregar',
        confirm: 'Confirmar',
        close: 'Cerrar',
        saving: 'Guardando ...',
        share: 'Compartir'
    },
    timeago: [
        ['justo ahora', 'en un rato'],
        ['hace %s segundos', 'en %s segundos'],
        ['hace 1 minuto', 'en 1 minuto'],
        ['hace %s minutos', 'en %s minutos'],
        ['hace 1 hora', 'en 1 hora'],
        ['hace %s horas', 'en %s horas'],
        ['hace 1 día', 'en 1 día'],
        ['hace %s días', 'en %s días'],
        ['hace 1 semana', 'en 1 semana'],
        ['hace %s semanas', 'en %s semanas'],
        ['hace 1 mes', 'en 1 mes'],
        ['hace %s meses', 'en %s meses'],
        ['hace 1 año', 'en 1 año'],
        ['hace %s años', 'en %s años']
    ]
};

module.exports = Locale;