const nonContributors = users.filter(user => !contributors.some(contributor => contributor.id === user.id));

<Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Select non-contributors"
                  onChange={handleChange}
                >
                  {nonContributors.map(nonContributor => (
                    <Option key={nonContributor.id} value={nonContributor.name}>
                      {/* {nonContributor.username} */}
                    </Option>
                  ))} 
                </Select>
3) tailwind.config.js:

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/***/**/*.{html,js,jsx,tsx}", "./src/**/*.{html,js,jsx,tsx}", "./src/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}


// 


