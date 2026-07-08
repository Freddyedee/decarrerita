"use client";

import { useState } from "react";
import { CreateUserResponse } from "@modules/user/application/dto/CreateUserResponse";
import { USER_ROLES } from "@modules/user/application/constants/UserRoles";
import { GetUserResponse } from "@modules/user/application/dto/GetUserResponse";

export default function UsersTestPage() {

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        passwordHash: "",
        role: 1
    });

    type ApiError = {
        message: string;
    };

    const [createResult, setCreateResult] = useState<CreateUserResponse | ApiError | null>(null);

    const [searchResult, setSearchResult] = useState<GetUserResponse | ApiError | null>(null);

    const [userId, setUserId] = useState("");


    async function createUser() {

        const response = await fetch("/api/users", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(form)

        });

         const data: CreateUserResponse = await response.json();

        setCreateResult(data);

    }

    async function searchUser() {

        const response = await fetch(`/api/users/${userId}`);

        const data: GetUserResponse = await response.json();

        setSearchResult(data);

    }

    return (

        <main style={{ padding: 40 }}>

            <h1>Users Module Test</h1>

            <hr />

            <h2>Create User</h2>

            <input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                    setForm({
                        ...form,
                        firstName: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) =>
                    setForm({
                        ...form,
                        lastName: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                    setForm({
                        ...form,
                        email: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) =>
                    setForm({
                        ...form,
                        phone: e.target.value
                    })
                }
            />

            <br /><br />

            <input
                placeholder="Password"
                type="password"
                value={form.passwordHash}
                onChange={(e) =>
                    setForm({
                        ...form,
                        passwordHash: e.target.value
                    })
                }
            />

            <br /><br />

            <select
                value={form.role}
                onChange={(e) =>
                    setForm({
                        ...form,
                        role: Number(e.target.value)
                    })
                }
            >
                {USER_ROLES.map((role) => (
                    <option
                        key={role.id}
                        value={role.id}
                    >
                        {role.label}
                    </option>
                ))}
            </select>

            <br /><br />

            <button onClick={createUser}>

                Create User

            </button>

            <br /><br />

            <pre>

                {JSON.stringify(createResult, null, 2)}

            </pre>

            <hr />

            <h2>Get User By Id</h2>

            <input
                placeholder="User Id"
                value={userId}
                onChange={(e) =>
                    setUserId(e.target.value)
                }
            />

            <br /><br />

            <button onClick={searchUser}>

                Search User

            </button>

            <br /><br />

            <pre>

                {JSON.stringify(searchResult, null, 2)}

            </pre>

        </main>

    );

}