'use strict';

async function httpGet(url) 
{
    try {
        const response = await fetch(url);
        return await response.json();
    } 
    catch (error) 
    {
        console.error(error);
        return [];
    }
}

async function httpPost(url, data, headers = {}) 
{
    const isFormData = data instanceof FormData;
    const options = {
        method: 'POST',
        headers: Object.assign(
            {},
            headers,
            isFormData ? { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } : { 'Content-Type': 'application/json' }
        ),
        body: isFormData ? data : JSON.stringify(data)
    };

    isFormData && delete options.headers['Content-Type'];

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function httpDelete(url, headers={})
{
    headers = Object.assign(headers, { 
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
    });

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });
        return response.ok;
    }
    catch (error) 
    {
        console.error(error);
        return false;
    }
}

function redirectTo(url) 
{
    window.location.href = url;
}