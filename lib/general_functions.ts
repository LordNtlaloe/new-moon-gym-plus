import Swal from 'sweetalert2'

export const showConfirmationMessage = (iconImage: any, message: string, tittle?: string) => {

    Swal.fire({
        title: tittle,
        icon: iconImage,
        text: message,
        showClass: {
            popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
            popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
    });
}

export const confirmAction = (title: string, text: string): boolean => {

    Swal.fire({
        icon: "warning",
        title: title,
        text: text,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't update`
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            return true
        } else if (result.isDenied) {
            Swal.fire("Changes were not saved", "", "info");
            return false
        }
    });

    return false

}

export const showToastMessage = (iconImage: any, message: string) => {

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: iconImage,
        title: message
    });
}

export const clearAllFields = () => {
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        if (input.type === 'text' || input.type == 'textarea') input.value = '';
        if (input.type == 'radio') {
            if (input.value === 'YES') {
                input.checked = true;
            }
        }
        if (input.type == 'checkbox') {
            input.checked = false;
        }
        if (input.type === 'file') {
            input.value = ""
        }

    });
};