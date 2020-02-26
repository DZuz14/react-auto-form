/* eslint-disable max-len */
/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { css, jsx } from '@emotion/core'

/** @function Spinner */
const Spinner = ({ loading }) => {
  return loading ? (
    <img
      src="https://i.imgur.com/01yMDgZ.gif"
      css={css`
        height: 30px;
        display: inline-block;
        margin-left: 10px;
      `}
    />
  ) : null
}

/** @function Message */
const Message = ({ status, text }) => {
  return status && status !== 'loading' ? (
    <div className={`message ${status}`}>{text}</div>
  ) : null
}

/**
 * @function Field
 */
const Field = ({ field, onChange }) => {
  const { label, ...attributes } = field

  return (
    <>
      <label>{field.label}</label>
      {(() => {
        switch (field.type) {
          case 'textarea':
            return <textarea onChange={onChange} {...attributes} />
          default:
            return <input onChange={onChange} {...attributes} />
        }
      })()}
    </>
  )
}

/**
 * @function AutoForm
 */
const AutoForm = ({ form, onSubmit, status }) => {
  const [fields, setFields] = useState(
    form.fields.map(field => ({
      ...field,
      name: field.name || field.label,
      value: ''
    }))
  )

  useEffect(() => {
    if (status === 'success')
      setFields(fields.map(field => ({ ...field, value: '' })))
  }, [status])

  const handleChange = e => {
    const name = e.target.getAttribute('name')
    const newFields = fields.map(field => {
      return field.name === name ? { ...field, value: e.target.value } : field
    })
    setFields(newFields)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const formData = fields.reduce((fields, field) => {
      return { ...fields, [field.name]: field.value }
    }, {})

    onSubmit(formData)
  }

  const { messages } = form.config

  return (
    <form css={AutoFormCSS} onSubmit={handleSubmit}>
      {fields.map(field => (
        <Field field={field} onChange={handleChange} />
      ))}

      <div style={{ marginTop: '20px' }}>
        <button disabled={status === 'success'} type="submit">
          {form.config.buttonText || 'Submit'}
        </button>

        <Spinner loading={status === 'loading'} />
        <Message status={status} text={messages[status]} />
      </div>
    </form>
  )
}

const AutoFormCSS = css`
  width: 420px;
  margin-left: 5px;

  input, textarea {
    display block;
    width: 100%;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    margin-bottom: .8rem;
  }

  label {
    margin-bottom: .5rem;
    display block;
    padding-left: 2px;
    color: #fff;
  }

  textarea {
    height: 100px;
  }

  button {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: .5rem 1.2rem;
    font-size: 1.15rem;
    line-height: 1.5;
    border-radius: .25rem;
    color: #fff;
    background-color: #F10068;
    cursor: pointer;
    margin-bottom: 1.5rem;
  }

  .message {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
  }

  .message.loading {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
  }

  .message.success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }

  .message.error {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }
`

export default AutoForm
