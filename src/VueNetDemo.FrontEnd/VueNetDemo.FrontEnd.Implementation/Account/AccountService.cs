﻿using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using VueNetDemo.FrontEnd.Contract.Account;
using VueNetDemo.FrontEnd.Shared.Models.Account;
using VueNetDemo.FrontEnd.Shared.Models.Configurations;

namespace VueNetDemo.FrontEnd.Implementation.Account
{
    public class AccountService : IAccountService
    {
        private readonly IConfiguration _configuration;
        private readonly AppConfiguration _appConfiguration;

        public AccountService(
            IConfiguration configuration,
            AppConfiguration appConfiguration
            )
        {
            _configuration = configuration;
            _appConfiguration = appConfiguration;
        }

        public async Task<LoginTokenModel> Login(LoginModel viewModel)
        {
            using (var httpClient = new HttpClient())
            {
                using (var response = await httpClient.PostAsJsonAsync($"{_appConfiguration.APIUri}account/login", viewModel))
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();

                        LoginTokenModel loginToken = JsonConvert.DeserializeObject<LoginTokenModel>(apiResponse);

                        return loginToken;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
        }
    }
}