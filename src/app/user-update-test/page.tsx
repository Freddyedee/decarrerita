"use client";

import { useState } from "react";

import { UserResponse } from "@modules/user/application/dto/UserResponse";

type ApiError = {
    message: string;
};

export default function UserUpdateTestPage() {

    const [profileForm, setProfileForm] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passwordHash: ""
    });

    const [statusForm, setStatusForm] = useState({
        userId: "",
        status: "ACTIVO"
    });

    const [profileResult, setProfileResult] =
        useState<UserResponse | ApiError | null>(null);

    const [statusResult, setStatusResult] =
        useState<UserResponse | ApiError | null>(null);

    async function updateProfile() {

        const response = await fetch(
            `/api/users/${profileForm.userId}/profile`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    firstName: profileForm.firstName,
                    lastName: profileForm.lastName,
                    email: profileForm.email,
                    phone: profileForm.phone,
                    passwordHash: profileForm.passwordHash
                })
            }
        );

        const data = await response.json();

        setProfileResult(data);

    }

    async function updateStatus() {

        const response = await fetch(
            `/api/users/${statusForm.userId}/status`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: statusForm.status
                })
            }
        );

        const data = await response.json();

        setStatusResult(data);

    }

    return (

        <main style={{ padding: 40 }}>

            <h1>User Update Test</h1>

            <hr />

            <h2>Update Profile</h2>

            <input
                placeholder="User Id"
                value={profileForm.userId}
                onChange={(e) =>
                    setProfileForm({
                        ...profileForm,
                        userId: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="First Name"
                value={profileForm.firstName}
                onChange={(e) =>
                    setProfileForm({
                        ...profileForm,
                        firstName: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Last Name"
                value={profileForm.lastName}
                onChange={(e) =>
                    setProfileForm({
                        ...profileForm,
                        lastName: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Email"
                value={profileForm.email}
                onChange={(e) =>
                    setProfileForm({
                        ...profileForm,
                        email: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Phone"
                value={profileForm.phone}
                onChange={(e) =>
                    setProfileForm({
                        ...profileForm,
                        phone: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password Hash"
                value={profileForm.passwordHash}
                onChange={(e) =>
                    setProfileForm({
                        ...profileForm,
                        passwordHash: e.target.value
                    })
                }
            />

            <br /><br />

            <button onClick={updateProfile}>

                Update Profile

            </button>

            <br /><br />

            <pre>

                {JSON.stringify(profileResult, null, 2)}

            </pre>

            <hr />

            <h2>Update Status</h2>

            <input
                placeholder="User Id"
                value={statusForm.userId}
                onChange={(e) =>
                    setStatusForm({
                        ...statusForm,
                        userId: e.target.value
                    })
                }
            />

            <br /><br />

            <select
                value={statusForm.status}
                onChange={(e) =>
                    setStatusForm({
                        ...statusForm,
                        status: e.target.value
                    })
                }
            >

                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
                <option value="SUSPENDIDO">SUSPENDIDO</option>

            </select>

            <br /><br />

            <button onClick={updateStatus}>

                Update Status

            </button>

            <br /><br />

            <pre>

                {JSON.stringify(statusResult, null, 2)}

            </pre>

        </main>

    );

}