import Swal from "sweetalert2";

const Modal = {
    success: (message) => {
        return Swal.fire({
            title: "Success",
            text: message,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#4d3686",
            background: "#ffffff",
            color: "#1e293b",
            iconColor: "#4d3686",
        });
    },

    error: (message) => {
        return Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#dc2626",
        });
    },

    loading: (message = "Loading...") => {
        return Swal.fire({
            title: message,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    },

    close: () => {
        Swal.close();
    },
};

export default Modal;